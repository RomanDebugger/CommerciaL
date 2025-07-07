'use client';
import { useSessionStore } from '@/app/store/useSessionStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeaderUser(){
    
const router = useRouter();
const { user, clearUser } = useSessionStore();
const [openProfile,setOpenProfile] = useState(false);
return(
    <>
    {user ? (
  <div className="relative group">
    <button 
    className="flex items-center space-x-2 text-sm font-medium"
    onClick={() => setOpenProfile(!openProfile)} >
      <img
        src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.email}`}
        alt="avatar"
        className="w-8 h-8 rounded-full"
      />
      <span>{user.email.split('@')[0]}</span>
    </button>

    <div className={`${openProfile ? "" : "hidden"} absolute right-0 mt-2 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-2  transition-opacity duration-200 z-10`}>
      <p className="text-sm text-gray-600 dark:text-gray-300 px-3 py-2 border-b border-gray-200 dark:border-slate-600">
        Logged in as <strong>{user.email}</strong>
      </p>
      <button
        onClick={async () => {
            try {
                await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', 
                });
            } catch (err) {
                console.error('Logout API failed:', err);
            } finally {
                clearUser();
                router.push('/auth');
            }
            }}

        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-800 rounded-md"
      >
        Logout
      </button>
    </div>
  </div>
) : (
  <button
    onClick={() => router.push('/auth')}
    className="bg-gradient-to-tr from-gr1 via-gr2 to-gr3 text-white px-4 py-2 rounded-full hover:from-gr2 hover:to-gr1 transition"
  >
    Create Account
  </button>
)}
</>
);
}