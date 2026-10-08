import React, { useState } from 'react';
import { loginAdmin } from '@/lib/admin/authEngine';
import { Lock, ShieldCheck, UserCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('superadmin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginAdmin(username, password);
    setLoading(false);

    if (res.success) {
      if (typeof window !== 'undefined') {
        window.location.replace('/admin');
      }
    } else {
      setError(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="space-y-8 max-w-md mx-auto py-12">
      <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl space-y-6 text-xs">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Authentication</h1>
          <p className="text-slate-500">Secure Role-Based Control Portal</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Username or Email</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. superadmin"
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  );
}
