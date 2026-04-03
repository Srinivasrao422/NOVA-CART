import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { z } from 'zod';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const login = useAuthStore(s => s.login);
  const register = useAuthStore(s => s.register);
  const googleLogin = useAuthStore(s => s.googleLogin);
  const fetchCart = useCartStore(s => s.fetchCart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const schema = isLogin
        ? z.object({
            email: z.string().email('Enter a valid email'),
            password: z.string().min(6, 'Password must be at least 6 characters'),
          })
        : z.object({
            name: z.string().min(2, 'Name is required'),
            email: z.string().email('Enter a valid email'),
            password: z.string().min(6, 'Password must be at least 6 characters'),
          });
      const parsed = schema.safeParse({ name, email, password });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message || 'Invalid input');
      }
      if (isLogin) {
        await login(email, password);
        toast({ title: 'Welcome back!', description: 'You have been logged in successfully.' });
      } else {
        await register(name, email, password);
        toast({ title: 'Account created!', description: 'Welcome to Nova Cart.' });
      }
      const nextUser = useAuthStore.getState().user;
      if (nextUser?.id) {
        await fetchCart(nextUser.id);
      }
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Please try again.';
      toast({ title: 'Authentication failed', description: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    const popup = window.open('', 'google-oauth', 'width=500,height=620');
    if (!popup) {
      setGoogleLoading(false);
      toast({ title: 'Popup blocked', description: 'Please allow popups and try again.' });
      return;
    }
    popup.document.write(`
      <!doctype html>
      <html><head><title>Google Sign-In</title><style>
      body{font-family:Arial,sans-serif;padding:24px;background:#f8fafc}
      .card{max-width:360px;margin:24px auto;background:#fff;padding:20px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08)}
      input{width:100%;padding:10px;margin:8px 0;border:1px solid #d1d5db;border-radius:8px}
      button{width:100%;padding:10px;border:0;border-radius:8px;background:#2563eb;color:#fff;font-weight:600;cursor:pointer}
      </style></head>
      <body><div class="card"><h3>Continue with Google</h3>
      <p style="font-size:12px;color:#64748b">Simulated OAuth popup</p>
      <input id="name" placeholder="Google name" value="Nova User" />
      <input id="email" type="email" placeholder="Google email" value="nova.user@gmail.com" />
      <button id="go">Continue</button></div>
      <script>
      document.getElementById('go').onclick=function(){
        const name=document.getElementById('name').value.trim();
        const email=document.getElementById('email').value.trim();
        if(!name||!email){alert('Name and email required');return;}
        window.opener.postMessage({source:'nova-google-oauth',name,email,googleId:'google_'+Date.now()}, '*');
        window.close();
      };
      </script></body></html>
    `);

    const onMessage = async (event: MessageEvent) => {
      const d = event.data;
      if (!d || d.source !== 'nova-google-oauth') return;
      window.removeEventListener('message', onMessage);
      try {
        await googleLogin({ email: d.email, name: d.name, googleId: d.googleId });
        const nextUser = useAuthStore.getState().user;
        if (nextUser?.id) await fetchCart(nextUser.id);
        toast({ title: 'Google login successful', description: `Signed in as ${d.email}` });
        navigate('/');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Google login failed';
        toast({ title: 'Google login failed', description: msg });
      } finally {
        setGoogleLoading(false);
      }
    };
    window.addEventListener('message', onMessage);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left: Branding panel */}
      <div className="hidden w-1/2 items-center justify-center bg-primary lg:flex">
        <div className="max-w-md px-12 text-center">
          <Link to="/" className="mb-8 inline-block font-display text-4xl font-bold text-primary-foreground">
            <span className="text-accent">Nova</span>Cart
          </Link>
          <p className="text-lg text-primary-foreground/70">
            Discover trending products at unbeatable prices. Join thousands of happy shoppers.
          </p>
        </div>
      </div>

      {/* Right: Auth form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center lg:hidden">
            <Link to="/" className="inline-block font-display text-2xl font-bold">
              <span className="text-gradient">Nova</span>Cart
            </Link>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? 'Sign in to access your account' : 'Sign up to start shopping'}
            </p>
          </div>

          {/* Google button */}
          <Button
            variant="outline"
            className="w-full gap-3 py-6 text-base"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <button type="button" className="text-xs text-accent hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 py-6 text-base shadow-accent">
              {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-accent hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
