import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  // app_metadata serverda boshqariladi (xavfsiz); eski akkauntlar uchun user_metadata ham tekshiriladi.
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin';
  return { session, user, isAdmin, loading };
}
