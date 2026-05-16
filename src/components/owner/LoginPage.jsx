import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isAuthEnabled } from '../../firebase';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await login(email, password);
      navigate('/owner/dashboard');
    } catch (err) {
      console.error("Login failed:", err);
      setError('Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="font-body-md text-on-background bg-surface min-h-screen flex flex-col bg-gradient-to-br from-surface-container-lowest to-surface-container">
      <main className="flex-grow flex items-center justify-center px-lg py-2xl">
        <div className="w-full max-w-[440px] animate-fade-in">
          {/* Branding Header */}
          <div className="text-center mb-xl relative">
            <button 
              onClick={() => navigate('/')}
              className="absolute left-0 top-0 flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-sm"
            >
              <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
              Back to Shop
            </button>
            <div className="inline-flex items-center justify-center p-sm bg-primary rounded-lg mb-md mt-lg">
              <span className="material-symbols-outlined text-white text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>print</span>
            </div>
            <h1 className="font-h2 text-h2 text-primary tracking-tight">PrintEase</h1>
            <p className="font-body-md text-on-surface-variant mt-xs">Owner Portal</p>
          </div>

          {/* Login Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_8px_30px_rgb(30,64,175,0.08)] border border-outline-variant/30 overflow-hidden">
            <div className="p-xl">
              {error && (
                <div className="mb-md p-sm bg-error-container text-on-error-container rounded-lg font-body-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-lg">
                <div className="space-y-sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                      placeholder="owner@printease.com" 
                    />
                  </div>
                </div>

                <div className="space-y-sm">
                  <div className="flex justify-between items-center">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                    <input 
                      type="password" 
                      id="password" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      className="w-full pl-xl pr-md py-sm bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-white py-sm px-lg rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all active:scale-[0.98] flex items-center justify-center gap-sm disabled:opacity-50"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                  {!isLoggingIn && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
              </form>
              
              {!isAuthEnabled && (
                <div className="mt-xl p-md bg-surface-container-low rounded-lg border border-outline-variant/30">
                  <p className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-xs tracking-wider">Demo Credentials</p>
                  <p className="font-body-sm text-body-sm text-on-surface mb-xs">Email: <span className="font-mono font-bold">admin@printease.com</span></p>
                  <p className="font-body-sm text-body-sm text-on-surface">Pass: <span className="font-mono font-bold">admin123</span></p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
