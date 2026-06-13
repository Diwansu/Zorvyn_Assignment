import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Wallet, Mail, Lock, AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Login Page using shadcn/ui components.
 */
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingLocal, setLoadingLocal] = useState(false);
  
  const { login, error, setError } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoadingLocal(true);
    try {
      await login(email, password);
      toast('Welcome back! Successfully logged in.', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      // Error is caught and set in AuthContext
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleQuickPrefill = (prefEmail) => {
    setEmail(prefEmail);
    setPassword('123456');
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Wallet className="h-6 w-6 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to access your finance dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 animate-slide-up">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-900/40 border-slate-800 text-white focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/40 border-slate-800 text-white focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all"
                disabled={loadingLocal}
              >
                {loadingLocal ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 border-t border-slate-800/60 pt-6">
            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
                Create one
              </Link>
            </p>

            {/* Evaluation shortcuts */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
                <KeyRound className="h-4 w-4 text-amber-500" />
                <span>Quick Prefill Accounts</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleQuickPrefill('admin@test.com')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                >
                  Admin
                </button>
                <button
                  onClick={() => handleQuickPrefill('analyst@test.com')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                >
                  Analyst
                </button>
                <button
                  onClick={() => handleQuickPrefill('viewer@test.com')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
                >
                  Viewer
                </button>
                <button
                  onClick={() => handleQuickPrefill('inactive@test.com')}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                >
                  Inactive
                </button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
