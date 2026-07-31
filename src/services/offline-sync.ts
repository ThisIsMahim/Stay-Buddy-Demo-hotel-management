// ──────────────────────── OFFLINE SYNC QUEUE ────────────────────────

import { useState, useEffect, useCallback } from 'react';

interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  resource: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
}

class OfflineSyncQueue {
  private queue: SyncOperation[] = [];
  private isOnline: boolean = navigator.onLine;
  private processing: boolean = false;
  private subscribers: Array<(operations: SyncOperation[]) => void> = [];

  constructor() {
    this.loadFromStorage();
    this.setupEventListeners();
    this.startProcessing();
  }

  // Load queue from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('sb_sync_queue');
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error);
    }
  }

  // Save queue to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('sb_sync_queue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save sync queue:', error);
    }
  }

  // Setup online/offline event listeners
  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.startProcessing();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Add operation to queue
  add(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>): void {
    const syncOp: SyncOperation = {
      ...operation,
      id: `sync_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
      retryCount: 0
    };

    this.queue.push(syncOp);
    this.saveToStorage();
    this.notifySubscribers();

    if (this.isOnline && !this.processing) {
      this.startProcessing();
    }
  }

  // Process queue when online
  private async startProcessing(): Promise<void> {
    if (!this.isOnline || this.processing) return;

    this.processing = true;

    while (this.queue.length > 0 && this.isOnline) {
      const operation = this.queue[0];
      
      try {
        await this.processOperation(operation);
        this.queue.shift(); // Remove successful operation
        this.saveToStorage();
        this.notifySubscribers();
      } catch (error) {
        console.error('Sync operation failed:', error);
        
        operation.retryCount++;
        
        if (operation.retryCount >= operation.maxRetries) {
          // Remove failed operation after max retries
          this.queue.shift();
          console.error('Operation failed after max retries:', operation);
        } else {
          // Move to end of queue for retry
          this.queue.shift();
          this.queue.push(operation);
          
          // Exponential backoff
          await this.delay(Math.pow(2, operation.retryCount) * 1000);
        }
        
        this.saveToStorage();
        this.notifySubscribers();
      }
    }

    this.processing = false;
  }

  // Process individual operation
  private async processOperation(operation: SyncOperation): Promise<void> {
    // This would make actual API calls in production
    // For now, we simulate the operation
    console.log('Processing sync operation:', operation);
    
    // Simulate API delay
    await this.delay(1000);
    
    // Simulate random failure (10% chance)
    if (Math.random() < 0.1) {
      throw new Error('Simulated API failure');
    }
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Subscribe to queue changes
  subscribe(callback: (operations: SyncOperation[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback([...this.queue]));
  }

  // Get queue status
  getStatus(): {
    isOnline: boolean;
    processing: boolean;
    queueLength: number;
    operations: SyncOperation[];
  } {
    return {
      isOnline: this.isOnline,
      processing: this.processing,
      queueLength: this.queue.length,
      operations: [...this.queue]
    };
  }

  // Clear queue
  clear(): void {
    this.queue = [];
    this.saveToStorage();
    this.notifySubscribers();
  }

  // Retry failed operations
  retryFailed(): void {
    this.queue.forEach(op => {
      op.retryCount = 0;
    });
    this.startProcessing();
  }
}

// Global sync queue instance
const syncQueue = new OfflineSyncQueue();

// Hook for using sync queue
export function useOfflineSync() {
  const [status, setStatus] = useState(() => syncQueue.getStatus());

  useEffect(() => {
    const unsubscribe = syncQueue.subscribe((operations) => {
      setStatus(syncQueue.getStatus());
    });

    return unsubscribe;
  }, []);

  const addOperation = useCallback((operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount'>) => {
    syncQueue.add(operation);
  }, []);

  const clearQueue = useCallback(() => {
    syncQueue.clear();
  }, []);

  const retryFailed = useCallback(() => {
    syncQueue.retryFailed();
  }, []);

  return {
    status,
    addOperation,
    clearQueue,
    retryFailed
  };
}

// Enhanced API wrapper with offline support
export function withOfflineSync<T extends (...args: unknown[]) => Promise<unknown>>(
  apiFunction: T,
  resourceType: string,
  options?: {
    maxRetries?: number;
    optimisticUpdate?: boolean;
  }
): T {
  return (async (...args: Parameters<T>) => {
    if (!navigator.onLine) {
      // Add to sync queue if offline
      syncQueue.add({
        type: 'CREATE',
        resource: resourceType,
        data: { args, method: apiFunction.name },
        maxRetries: options?.maxRetries || 3
      });

      if (options?.optimisticUpdate) {
        // Return optimistic response
        return { success: true, offline: true };
      }

      throw new Error('Device is offline. Operation queued for sync.');
    }

    try {
      return await apiFunction(...args);
    } catch (error) {
      // Add to sync queue if API call fails
      syncQueue.add({
        type: 'CREATE',
        resource: resourceType,
        data: { args, method: apiFunction.name, error },
        maxRetries: options?.maxRetries || 3
      });

      throw error;
    }
  }) as T;
}
