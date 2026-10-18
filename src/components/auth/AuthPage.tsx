import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Logo } from '../brand/Logo.tsx';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  Cloud, 
  Users, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup' | 'forgot';
  onSuccess?: () => void;
  onNavigate?: (route: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  initialMode = 'login', 
  onSuccess,
  onNavigate 
}) => {
  const { 
    currentUser,
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithEmail, 
    signUpWithEmail, 
    resetPassword,
    authError,
    clearError,
    pendingAction,
    setPendingAction
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [localValidation, setLocalValidation] = useState<string | null>(null);
  const [showFbHelper, setShowFbHelper] = useState(false);

  const handlePostAuthRedirect = () => {
    if (onSuccess) {
      onSuccess();
    } else if (pendingAction) {
      const target = pendingAction.route;
      setPendingAction(null);
      if (onNavigate) onNavigate(target);
    } else if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handleGoogleAuth = async () => {
    clearError();
    setLocalValidation(null);
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      handlePostAuthRedirect();
    } catch (e) {
      // Handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookAuth = async () => {
    clearError();
    setLocalValidation(null);
    setIsSubmitting(true);
    try {
      await loginWithFacebook();
      handlePostAuthRedirect();
    } catch (e: any) {
      if (e?.message?.includes('Meta') || e?.message?.includes('Facebook')) {
        setShowFbHelper(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalValidation(null);

    if (mode === 'forgot') {
      if (!email.trim()) {
        setLocalValidation('Please enter your email address.');
        return;
      }
      setIsSubmitting(true);
      try {
        await resetPassword(email);
        setResetSent(true);
      } catch (err) {
        // Handled by AuthContext
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setLocalValidation('Please enter your full name or company name.');
        return;
      }
      if (password.length < 6) {
        setLocalValidation('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalValidation('Passwords do not match. Please re-enter.');
        return;
      }
      setIsSubmitting(true);
      try {
        await signUpWithEmail(email, password, fullName);
        handlePostAuthRedirect();
      } catch (err) {
        // Handled by AuthContext
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Login mode
    if (!email.trim() || !password) {
      setLocalValidation('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await loginWithEmail(email, password);
      handlePostAuthRedirect();
    } catch (err) {
      // Handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Branding / Value Proposition Column (Desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="cursor-pointer" onClick={() => onNavigate && onNavigate('home')}>
              <Logo variant="full" size="md" />
            </div>

            <div className="space-y-2 pt-4">
              <span className="text-xs font-bold text-teal-400 tracking-wide uppercase">SaaS Cloud Workspace</span>
              <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
                One Account. Professional Invoicing Everywhere.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to securely manage client directories, access autosaved drafts, synchronize business preferences, and download publication-ready invoices.
              </p>
            </div>

            {/* Benefit Checkpoints */}
            <div className="space-y-3.5 pt-4 text-xs text-slate-200">
              <div className="flex items-start gap-2.5">
                <Cloud className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cloud-Synchronized Drafts:</strong> Edit on laptop, review on tablet without losing line items.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Private Customer Directory:</strong> Save repeat client addresses, terms, and tax numbers.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-Trust Security:</strong> Strict per-user Firestore isolation guarantees your billing data is 100% private.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Trusted by thousands of independent consultants and creative studios worldwide.</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            {/* Header / Mode Indicator */}
            <div className="space-y-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'signup' && 'Create Your SaaS Account'}
                {mode === 'forgot' && 'Reset Your Password'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                {mode === 'login' && 'Log in to access your invoice history, drafts, and customer database.'}
                {mode === 'signup' && 'Sign up to unlock the Invoice Generator, cloud storage, and dashboard.'}
                {mode === 'forgot' && 'Enter your email address to receive password reset instructions.'}
              </p>
            </div>

            {/* Error & Validation Messages */}
            {(authError || localValidation) && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">{localValidation || authError}</p>
                </div>
              </div>
            )}

            {/* Reset Sent Confirmation */}
            {resetSent && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2 text-xs text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reset Link Sent!</p>
                  <p className="mt-0.5">Please check your inbox at <span className="font-mono">{email}</span> to set a new password.</p>
                </div>
              </div>
            )}

            {/* Facebook Configuration Helper Modal / Drawer */}
            {showFbHelper && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs text-blue-900">
                <div className="flex items-center gap-1.5 font-bold text-blue-800">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Facebook Developer App Configuration Required</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Facebook Login requires an active Meta App ID and Secret configured in the Firebase Console under <strong>Authentication &gt; Sign-in method &gt; Facebook</strong> with the OAuth redirect URI added to your Meta Developer App.
                </p>
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFbHelper(false)}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
                  >
                    Got It
                  </button>
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="px-2.5 py-1 bg-white border border-blue-300 text-blue-700 rounded text-xs font-semibold hover:bg-blue-50"
                  >
                    Continue with Google Instead
                  </button>
                </div>
              </div>
            )}

            {/* OAuth Buttons (Only shown for login and signup) */}
            {mode !== 'forgot' && (
              <div className="space-y-2.5">
                {/* Genuine Google Provider Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Genuine Facebook Provider Button */}
                <button
                  type="button"
                  onClick={handleFacebookAuth}
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-lg text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
                      Or with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-fullname" className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name or Company
                  </label>
                  <input
                    id="auth-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Jane Doe or Apex Media"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-900"
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-900"
                />
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          clearError();
                          setLocalValidation(null);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-3 pr-10 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label htmlFor="auth-confirm-password" className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="auth-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-3 pr-10 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Please wait...</span>
                ) : (
                  <>
                    <span>
                      {mode === 'login' && 'Log In to Workspace'}
                      {mode === 'signup' && 'Create Free Account'}
                      {mode === 'forgot' && 'Send Password Reset Email'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Switchers */}
            <div className="pt-2 text-center text-xs text-slate-600 space-y-2">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      clearError();
                      setLocalValidation(null);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Sign Up Free
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      clearError();
                      setLocalValidation(null);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              ) : (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      clearError();
                      setLocalValidation(null);
                    }}
                    className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    Return to Log In
                  </button>
                </p>
              )}

              {mode === 'signup' && (
                <p className="text-[11px] text-slate-500 pt-1">
                  By creating an account, you agree to our{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('terms')}
                    className="underline hover:text-slate-800"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('privacy')}
                    className="underline hover:text-slate-800"
                  >
                    Privacy Policy
                  </button>.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
