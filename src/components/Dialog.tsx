import { useEffect, useRef, type ReactNode } from 'react';

interface Props { open: boolean; onClose: () => void; label: string; children: ReactNode }

/** Native <dialog>: focus trap, Escape va backdrop brauzerning o'zidan keladi. */
export default function Dialog({ open, onClose, label, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dialog" aria-label={label} onClose={onClose} onClick={(e) => e.target === e.currentTarget && onClose()}>
      {open && children}
    </dialog>
  );
}
