import { useEffect } from 'react';
import { useSessionStore } from '@/app/store/useSessionStore';

export default function useSyncUser() {
  const { user, setUser, clearUser } = useSessionStore();

  useEffect(() => {
    if (user) return;

    const sync = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Unauthorized');

        const data = await res.json();
        setUser(data.user); 
      } catch (_err) {
        clearUser();
      }
    };

    sync();
  }, [user, setUser, clearUser]);
}
