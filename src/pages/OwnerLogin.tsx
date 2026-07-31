import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function OwnerLogin() {
    // DEV REMINDER: Remove these defaults in production!
    const [email, setEmail] = useState('owner@staybuddy.com');
    const [password, setPassword] = useState('password123');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/owner/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            // Save token and info
            localStorage.setItem('ownerToken', data.token);
            localStorage.setItem('ownerUser', JSON.stringify(data));

            toast({ title: 'Success', description: 'Logged in successfully' });
            navigate('/owner');
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Owner Login</CardTitle>
                    <p className="text-sm text-red-500 text-center font-medium mt-2 bg-red-50 p-2 rounded">
                        DEV: Use 'owner@staybuddy.com' / 'password123' <br />
                        (Remove strictly before production!)
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label>Email</label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@staybuddy.com" required />
                        </div>
                        <div className="space-y-2">
                            <label>Password</label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
