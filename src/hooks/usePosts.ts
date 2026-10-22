import { useCallback, useEffect, useState } from 'react';
import type { Post } from '../types';

type State = 'loading' | 'ready' | 'error';

export function usePosts(limit = 30) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [state, setState] = useState<State>('loading');

  const load = useCallback(async () => {
    // Supabase klienti alohida chunk: hero yuklanishini kutdirmaydi
    const { supabase } = await import('../lib/supabase');
    const { data, error } = await supabase
      .from('posts')
      .select('id,title,description,image_url,date')
      .order('date', { ascending: false })
      .limit(limit);
    if (error) return setState('error');
    setPosts(data as Post[]);
    setState('ready');
  }, [limit]);

  useEffect(() => { void load(); }, [load]);
  return { posts, state, reload: load };
}
