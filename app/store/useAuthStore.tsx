import { create } from 'zustand';

type AuthMode = 'password' | 'otp-request' | 'otp-verify';
type FormType = 'login' | 'signup';

interface useAuthStore {
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  formType: FormType;
  authMode: AuthMode;

  setPhone: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  setOtp: (v: string) => void;
  toggleFormType: () => void;
  toggleAuthMode: () => void;
  resetAuth: () => void;
}

export const useAuthStore = create<useAuthStore>((set) => ({
  phone: '',
  password: '',
  confirmPassword: '',
  otp: '',
  formType: 'login',
  authMode: 'password',

  setPhone: (v) => set({ phone: v }),
  setPassword: (v) => set({ password: v }),
  setConfirmPassword: (v) => set({ confirmPassword: v }),
  setOtp: (v) => set({ otp: v }),

  toggleFormType: () =>
    set((state) => ({
      formType: state.formType === 'login' ? 'signup' : 'login',
      authMode: 'password',
      password: '',
      confirmPassword: '',
      otp: '',
    })),

  toggleAuthMode: () =>
    set((state) => ({
      authMode: state.authMode === 'password' ? 'otp-request' : 'password',
      password: '',
      otp: '',
    })),

  resetAuth: () =>
    set({
      phone: '',
      password: '',
      confirmPassword: '',
      otp: '',
      formType: 'login',
      authMode: 'password',
    }),
}));