'use client';
import React, { useEffect } from 'react';
import {
  Phone,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
} from 'lucide-react';
import AuthToggleButtons from './AuthToggle';
import { useAuthStore } from '@/app/store/useAuthStore';

interface Props {
  mode: 'buyer' | 'seller';
  showPassword: boolean;
  toggleShowPassword: () => void;
  showConfirmPassword: boolean;
  toggleShowConfirmPassword: () => void;
}

export default function AuthCard({
  mode,
  showPassword,
  toggleShowPassword,
  showConfirmPassword,
  toggleShowConfirmPassword,
}: Props) {
  const {
    email,
    password,
    confirmPassword,
    otp,
    formType,
    authMode,
    setEmail,
    setPassword,
    setConfirmPassword,
    setOtp,
  } = useAuthStore();
  
  useEffect(()=>{
   setEmail('');
   setPassword('');
   setConfirmPassword('');
   setOtp('')
  },[mode,formType]);

  return (
    <div className="space-y-6 p-10 rounded-xl">
      <AuthToggleButtons />

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {mode === 'seller' ? 'Business Mail' : 'E-mail'}
        </label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 border rounded-2xl focus:outline-none focus:ring-2 text-gray-900 dark:text-white transition-all placeholder-gray-500 dark:placeholder-gray-400 ${
              mode === 'seller'
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-600 focus:ring-indigo-500'
                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-purple-500'
            }`}
            placeholder="Enter Your Email"
            required
          />
        </div>
      </div>

      {authMode === 'password' && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {(formType === 'signup') && authMode === 'password' && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={toggleShowConfirmPassword}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {(authMode === 'otp-request' || authMode === 'otp-verify') && (
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
            OTP Code
          </label>
          <div className="relative">
            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-2xl font-mono tracking-widest"
              placeholder="000000"
              required
            />
          </div>
        </div>
      )}
    </div>
  );
}
