import { useState } from 'react';
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await window.electronAPI.login({ username, password });
      
      if (result) {
        onLoginSuccess();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-grey p-8">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-apple-blue to-blue-600 rounded-3xl shadow-apple-lg mb-6">
            <LogIn className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            Brothers Fitness
          </h1>
          <p className="text-gray-500 text-sm">
            Gym Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-apple rounded-3xl shadow-apple-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 tracking-tight">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-apple-grey border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-gray-900 placeholder-gray-400"
                placeholder="Enter your username"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-apple-grey border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue transition-all text-gray-900 placeholder-gray-400"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-apple-red text-sm px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-apple-blue hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Hint */}
          <p className="mt-6 text-center text-xs text-gray-400">
            Default: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}