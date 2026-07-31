import { useMemo, useCallback, useRef, useState, useEffect } from 'react';

// Advanced memoization with LRU cache
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Memoized function with cache
export function useMemoizedFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  cacheSize: number = 50
): T {
  const cacheRef = useRef(new LRUCache<string, ReturnType<T>>(cacheSize));

  return useCallback(((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    const cached = cacheRef.current.get(key);
    
    if (cached !== undefined) {
      return cached;
    }

    const result = fn(...args) as ReturnType<T>;
    cacheRef.current.set(key, result);
    return result;
  }) as T, [fn]);
}

// Deep comparison utility
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  const ref = useRef<{ deps: React.DependencyList; value: T }>();

  if (!ref.current || !isEqual(deps, ref.current.deps)) {
    ref.current = { deps, value: factory() };
  }

  return ref.current.value;
}

// Simple deep equality check
function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => isEqual(val, b[index]));
  }
  
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
  }
  
  return false;
}

// Memoized selector for complex data
export function useSelectoredData<T, R>(
  data: T,
  selector: (data: T) => R
): R {
  return useMemo(() => selector(data), [data, selector]);
}

// Debounced value hook
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttled function hook
export function useThrottledFunction<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      fn(...args);
      lastRun.current = Date.now();
    }
  }) as T, [fn, delay]);
}

// Performance monitor hook
export function usePerformanceMonitor(name: string) {
  const startTimeRef = useRef<number>();

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
  }, []);

  const end = useCallback(() => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current;
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      startTimeRef.current = undefined;
      return duration;
    }
    return 0;
  }, [name]);

  return { start, end };
}

// Memoized async function
export function useAsyncMemo<T>(
  asyncFn: () => Promise<T>,
  deps: React.DependencyList
): { data: T | undefined; loading: boolean; error: Error | undefined } {
  const [state, setState] = useState<{
    data: T | undefined;
    loading: boolean;
    error: Error | undefined;
  }>({ data: undefined, loading: true, error: undefined });

  useEffect(() => {
    let cancelled = false;

    const runAsync = async () => {
      try {
        setState({ data: undefined, loading: true, error: undefined });
        const result = await asyncFn();
        if (!cancelled) {
          setState({ data: result, loading: false, error: undefined });
        }
      } catch (err) {
        if (!cancelled) {
          setState({ data: undefined, loading: false, error: err as Error });
        }
      }
    };

    runAsync();

    return () => {
      cancelled = true;
    };
  }, deps);

  return state;
}
