'use client';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/app/store/useAuthStore';

export default function AuthToggleButtons() {
  const { formType, toggleFormType } = useAuthStore();

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl mb-6 flex">
      <button
        type="button"
        onClick={() => formType !== 'login' && toggleFormType()}
        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
          formType === 'login'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <LogIn className="w-4 h-4" />
        <span>Login</span>
      </button>
      <button
        type="button"
        onClick={() => formType !== 'signup' && toggleFormType()}
        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
          formType === 'signup'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <UserPlus className="w-4 h-4" />
        <span>Sign Up</span>
      </button>
    </div>
  );
}
