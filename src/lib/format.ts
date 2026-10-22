export const formatPhone = (p: string) => p.replace(/^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/, '+998 $1 $2 $3 $4');
export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('uz', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
export const errMsg = (e: unknown) => (e as { message?: string })?.message ?? 'noma’lum xatolik';
