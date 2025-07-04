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
          return 'Verify & Activate Business Account';
      }
    } else if (formType === 'signup') {
      switch (authMode) {
        case 'password':
          return 'Create Account';
        case 'otp-request':
          return 'Send OTP';
        case 'otp-verify':
          return 'Verify & Create Account';
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
    if (authMode === 'otp-verify') return <CheckCircle2 className="w-5 h-5" />;
    if (formType === 'signup') return <UserPlus className="w-5 h-5" />;
    return <ArrowRight className="w-5 h-5" />;
  };

  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={loading}
      className="w-full bg-gradient-to-r from-gr1 to-gr2 hover:from-gr2 hover:to-gr1 text-white font-semibold py-4  rounded-2xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        <>
          {getButtonIcon()}
          <span>{getButtonLabel()}</span>
        </>
      )}
    </button>
  );
}
