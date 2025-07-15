'use client';

import { useSessionStore } from '@/app/store/useSessionStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import toast from 'react-hot-toast';
import useSyncUser from '@/app/hooks/useSyncUser';

export default function HeaderUser() {
  useSyncUser();
  const router = useRouter();
  const { user } = useSessionStore();
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      useSessionStore.persist.clearStorage();
      useSessionStore.getState().clearUser();
    } catch (_err) {
      toast.error('Logout failed.');
    } finally {
      router.push('/auth');
    }
  };

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth')}
        className="bg-gradient-to-tr from-gr1 via-gr2 to-gr3 text-white hover:from-gr2 hover:to-gr1 transition p-2 text-sm rounded-xl whitespace-nowrap"
      >
        Login / Register
      </button>
    );
  }

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setOpenProfile(!openProfile)}
        className="flex items-center space-x-2 text-sm font-medium"
        aria-label="User menu"
        aria-expanded={openProfile}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.email}`}
          alt={`${user.email}'s avatar`}
          className="w-8 h-8 rounded-full"
          width={32}
          height={32}
        />
        <span className="sr-only">User menu</span>
        <Menu className="w-4 h-4 md:hidden text-white" />
      </button>

      <div
        className={`${
          openProfile ? 'block' : 'hidden'
        } absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 shadow-xl rounded-xl p-2 z-50`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-300 px-3 py-2 border-b border-gray-200 dark:border-slate-600 truncate">
          <strong>{user.email}</strong>
        </p>

        <div className="flex flex-col gap-1 px-3 py-2 dark:text-white">
          {user.role === 'BUYER' && (
            <>
              <button
                onClick={() => {
                  router.push('/buyer/cart');
                  setOpenProfile(false);
                }}
                className="text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded-md flex items-center gap-2"
              >
                <span>🛒</span>
                <span>My Cart</span>
              </button>
              <button
                onClick={() => {
                  router.push('/buyer/orders');
                  setOpenProfile(false);
                }}
                className="text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded-md flex items-center gap-2"
              >
                <span>📦</span>
                <span>My Orders</span>
              </button>
              <button
                onClick={() => {
                  router.push('/buyer/mypayments');
                  setOpenProfile(false);
                }}
                className="text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded-md flex items-center gap-2"
              >
                <span>💵</span>
                <span>My Payments</span>
              </button>
            </>
          )}
          <button
            onClick={() => {
              router.push(user.role === 'SELLER' ? '/seller/profile' : '/buyer/profile');
              setOpenProfile(false);
            }}
            className="text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-2 rounded-md flex items-center gap-2"
          >
            <span>⚙️</span>
            <span>Edit Profile</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full text-center px-3 py-2 text-sm text-white bg-red-700 hover:bg-red-600 dark:hover:bg-red-800 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}