'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/app/store/useAuthStore';
import {useSessionStore} from '@/app/store/useSessionStore';

import AuthCard from '../components/Auth/AuthCard';
import AuthSubmitButton from '../components/Auth/AuthSubmit';

import { Building2, ShoppingBasket, KeyRound } from 'lucide-react';

interface Props {
  mode: 'buyer' | 'seller';
}

export default function AuthForm({ mode }: Props) {
  const router = useRouter();
  const {
    email, password, confirmPassword, otp,
    formType, authMode, 
    toggleFormType, toggleAuthMode
  } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev);
  
  const handleSignup = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      throw new Error('Please enter a valid email address (e.g., user@example.com)');
    }
    if (authMode === 'password') {
      if (!password || !confirmPassword) throw new Error('Enter and confirm your password');

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
      if (!passwordRegex.test(password)) {
        throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords mismatch');  
      }

      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: mode.toUpperCase(), 
          purpose: 'SIGNUP',
        }),
      });
      if (!res.ok) throw new Error('Failed to request OTP');

      useAuthStore.setState({ authMode: 'otp-verify' });
      return;
    }

    if (authMode === 'otp-verify') {
      if (!otp || otp.length !== 6) throw new Error('Enter a valid 6-digit OTP');
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, purpose: 'SIGNUP' }),
      });
      if (!res.ok) throw new Error('OTP verification failed');
      const data = await res.json();
      useSessionStore.getState().setUser(data.user);
      router.push(mode === 'buyer' ? '/home' : '/seller');
    }
  };
  
  const handleLogin = async () => {
    if (authMode === 'password') {
      if (!password) throw new Error('Enter password');

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
  
      const expectedRole = mode.toUpperCase();
      if (data.user.role !== expectedRole) {
        throw new Error(`⚠️ Login portal mismatch. You are registered as ${data.user.role}, not ${expectedRole}.`);
      }      
      useSessionStore.getState().setUser(data.user);
      router.push(mode === 'buyer' ? '/home' : '/seller');
      return;
    }

    if (authMode === 'otp-request') {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'LOGIN' }),
      });

      if (!res.ok) throw new Error('Failed to request OTP');
      useAuthStore.setState({ authMode: 'otp-verify' });
      return;
    }

    if (authMode === 'otp-verify') {
      if (!otp || otp.length !== 6) throw new Error('Enter a valid 6-digit OTP');

      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: otp, purpose: 'LOGIN' }),
      });

      if (!res.ok) throw new Error('OTP login failed');
      const data = await res.json();
      const expectedRole = mode.toUpperCase();
      if (data.user.role !== expectedRole) {
        throw new Error(`⚠️ Login portal mismatch. You are registered as ${data.user.role}, not ${expectedRole}.`);
      }
      useSessionStore.getState().setUser(data.user);
      router.push(mode === 'buyer' ? '/home' : '/seller');
    }
  };

  
  const handleSubmit = async () => {
    if (!email) return alert('Enter Email');

    setLoading(true);
    try {
      if (formType === 'signup') {
        await handleSignup();
      } else if (formType === 'login') {
        await handleLogin();
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex justify-center pb-8 px-4 pt-5'>
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg ${
            mode === 'seller'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
              : 'bg-gradient-to-r from-purple-600 to-purple-700'}`}
          >
            {mode === 'seller' ? 
              <Building2 className="w-5 h-5 sm:w-8 sm:h-8 text-white" /> : 
              <ShoppingBasket className="w-5 h-5 sm:w-8 sm:h-8 text-white" />}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            {formType === 'signup'
              ? `Create ${mode === 'seller' ? 'Business' : ''} Account`
              : `Login as ${mode === 'seller' ? 'Seller' : 'Buyer'}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {authMode === 'otp-verify'
              ? 'Enter the OTP sent to your E-Mail'
              : (formType === 'signup' ? 'Join us today' : 'Sign in to your account')}
          </p>
        </div>

        <div className="mx-2 sm:mx-[20px] bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-md">
          <AuthCard
            mode={mode}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            showConfirmPassword={showConfirmPassword}
            toggleShowConfirmPassword={toggleShowConfirmPassword}
          />
          <div className='p-3 sm:p-4'>
            <AuthSubmitButton
              mode={mode}
              loading={loading}
              onSubmit={handleSubmit}
            />

            {(formType === 'login') && (
              <div className="text-center pt-3 sm:pt-4">
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="inline-flex items-center justify-center text-xs sm:text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-200 space-x-1 sm:space-x-2"
                >
                  <KeyRound className="w-3 h-3 sm:w-4 sm:h-4" />
                  {authMode === 'password' ? (
                    <span>Login with OTP instead</span>
                  ) : (
                    <span>Login with Password instead</span>
                  )}
                </button>
              </div>
            )}

            {authMode === 'otp-verify' && (
              <div className="text-center pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Did not receive the code?
                </p>
                <div className="flex space-x-3 sm:space-x-4 justify-center">
                  <button
                    type="button"
                    onClick={() => useAuthStore.setState({ authMode: 'otp-request' })}
                    className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-200"
                  >
                    Resend OTP
                  </button>
                  {formType === 'login' && (
                    <button
                      type="button"
                      onClick={() => useAuthStore.setState({ authMode: 'password' })}
                      className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-colors duration-200"
                    >
                      Use Password
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-4 sm:mt-6">
          {mode === 'buyer' ? (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Are you a seller?{' '}
              <button
                type="button"
                onClick={() => {
                  router.push('/auth/business');
                  toggleAuthMode();
                  toggleFormType();
                }}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Login to our Business Portal
              </button>
            </p>
          ) : (
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              Not a seller?{' '}
              <button
                type="button"
                onClick={() => {
                  router.push('/auth');
                  toggleAuthMode();
                  toggleFormType();
                }}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Back to Buyer Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}