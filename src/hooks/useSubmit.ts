import { useState } from 'react';

export type Status = 'idle' | 'sending' | 'ok' | 'error';

export function useSubmit(kind: 'application' | 'feedback') {
  const [status, setStatus] = useState<Status>('idle');
  const submit = async (payload: Record<string, string>) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, ...payload }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('ok');
      return true;
    } catch {
      setStatus('error');
      return false;
    }
  };
  return { status, submit };
}
