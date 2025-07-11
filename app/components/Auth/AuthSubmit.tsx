'use client';
import { CheckCircle2, UserPlus, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';

interface Props {
  mode: 'buyer' | 'seller';
  loading: boolean;
  onSubmit: () => void;
}

export default function AuthSubmitButton({ mode, loading, onSubmit }: Props) {
  const { formType, authMode } = useAuthStore();

  const getButtonLabel = () => {
    if (loading) return 'Processing...';
    if (mode === 'seller') {
      switch (authMode) {
        case 'password':
          return 'Create Business Account';
        case 'otp-request':
          return 'Send Verification Code';
        case 'otp-verify':
          return 'Verify Business';
      }
    } else if (formType === 'signup') {
      switch (authMode) {
        case 'password':
          return 'Create Account';
        case 'otp-request':
          return 'Send OTP';
        case 'otp-verify':
          return 'Verify Account';
      }
    } else {
      switch (authMode) {
        case 'password':
          return 'Sign In';
        case 'otp-request':
          return 'Send OTP';
        case 'otp-verify':
          return 'Verify OTP';
      }
    }
  };

  const getButtonIcon = () => {
    if (loading) return null;
    if (authMode === 'otp-verify') return <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />;
    if (formType === 'signup') return <UserPlus className="w-4 h-4 md:w-5 md:h-5" />;
    return <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />;
  };

  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={loading}
      className="w-full bg-gradient-to-r from-gr1 to-gr2 hover:from-gr2 hover:to-gr1 text-white font-semibold py-2 px-4 md:py-3 rounded-xl md:rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99] text-sm md:text-base"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white"></div>
      ) : (
        <>
          {getButtonIcon()}
          <span className="whitespace-nowrap">{getButtonLabel()}</span>
        </>
      )}
    </button>
  );
}