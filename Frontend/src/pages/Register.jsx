import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Wallet, User, Mail, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Register Page using shadcn/ui.
 */
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Viewer');
  const [loadingLocal, setLoadingLocal] = useState(false);

  const { register, error, setError } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoadingLocal(true);
    try {
      await register(name, email, password, role);
      toast('Account registered successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in Context
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 text-slate-100">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Wallet className="h-6 w-6 text-indigo-400" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">Create Account</CardTitle>
            <CardDescription className="text-slate-400">
              Get started with your finance portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400 animate-slide-up">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-slate-900/40 border-slate-800 text-white focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
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
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-slate-900/40 border-slate-800 text-white focus-visible:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Assign Role</Label>
                <div className="relative flex items-center">
                  <ShieldCheck className="absolute left-3.5 top-3 h-4 w-4 text-slate-500 z-10" />
                  <Select value={role} onValueChange={(val) => setRole(val)}>
                    <SelectTrigger className="pl-10 bg-slate-900/40 border-slate-800 text-white focus:ring-indigo-500">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      <SelectItem value="Viewer" className="focus:bg-slate-800 focus:text-white">Viewer (Read-only Summary)</SelectItem>
                      <SelectItem value="Analyst" className="focus:bg-slate-800 focus:text-white">Analyst (Detailed Analytics)</SelectItem>
                      <SelectItem value="Admin" className="focus:bg-slate-800 focus:text-white">Admin (Full Control)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-500/20 transition-all mt-2"
                disabled={loadingLocal}
              >
                {loadingLocal ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-800/60 pt-6">
            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
