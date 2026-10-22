# 1-sonli kasb-hunar texnikumi — rasmiy sayt

React 18 + TypeScript + Vite. Ma'lumotlar bazasi va autentifikatsiya: Supabase. Deploy: Vercel.

## Ishga tushirish

```bash
npm install
cp .env.example .env     # Supabase qiymatlari tayyor
npm run dev              # sayt (ariza/fikr yuborish /api talab qiladi, pastga qarang)
npm run build            # tsc + vite build
```

<!-- I'm here -->

`/api/notify` (Telegramga yuborish) va `/api/assistant` (Gemini yordamchi) Vercel funksiyalari, shuning uchun lokalda server API'larini sinash uchun `npx vercel dev` ishlating. Gemini javoblari uchun `GEMINI_API_KEY` ni faqat server muhitiga kiriting; kalitni `VITE_` prefiksi bilan brauzerga chiqarmang. Kalit sozlanmagan bo‘lsa, assistant asosiy savollarga mahalliy javoblarni ko‘rsatadi.

## Vercel sozlamalari (Settings → Environment Variables)

| Nomi                                          | Izoh                           |
| --------------------------------------------- | ------------------------------ |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | Public qiymatlar               |
| `TELEGRAM_APPLICATION_TOKEN`                  | Ariza yuboriladigan bot tokeni |
| `TELEGRAM_FEEDBACK_TOKEN`                     | Fikr-mulohaza boti tokeni      |
| `TELEGRAM_CHAT_IDS`                           | Vergul bilan: `id1,id2,id3`    |
| `GEMINI_API_KEY`                              | Gemini API kaliti (server only) |
| `GEMINI_MODEL`                                | Ixtiyoriy, standart `gemini-3.8-flash` |

## Supabase bazasini qayta yaratish

1. Supabase’da yangi project yarating yoki mavjud projectni oching.
2. Dashboard → SQL Editor’da `supabase/schema.sql` fayli mazmunini ishga tushiring. Bu `posts` jadvali, RLS siyosatlari va `posts-images` storage bucketini yaratadi.
3. Dashboard → Project Settings → API’dan Project URL va publishable/anon key’ni olib, `.env` ichidagi `VITE_SUPABASE_URL` va `VITE_SUPABASE_ANON_KEY` qiymatlarini yangilang. Vercel’da ham shu ikkita public env qiymatini yangilang.
4. Admin foydalanuvchining `app_metadata` qismida `role: admin` bo‘lishi kerak. Buni Supabase Dashboard → Authentication → Users orqali admin akkauntga bering.

Introduction (`src/components/IntroductionSection.tsx`) ma’lumotlari bazaga bog‘lanmagan, sayt ichida saqlanadi va Supabase jadvaliga ehtiyoj sezmaydi.

## Xavfsizlik (muhim)

- Eski saytda ikkala bot tokeni brauzer kodida ochiq edi. **@BotFather → /revoke orqali ikkalasini ham yangilang**, yangi tokenlarni faqat Vercel env'ga qo'ying. Eski tokenlar git tarixida ham qolgan.
- Admin huquqi haqiqiy himoyasi Supabase **RLS** siyosatlarida bo'lishi kerak (`posts` jadvali va `posts-images` bucket uchun insert/delete faqat admin uchun). Frontend tekshiruvi faqat qulaylik uchun.
- Admin rolini `user_metadata` o'rniga `app_metadata.role = 'admin'` ga o'tkazing (`user_metadata`ni foydalanuvchi o'zi o'zgartira oladi).

## Tuzilma

```
api/notify.ts        Telegram yuboruvchi serverless funksiya (validatsiya + honeypot)
src/data/            programs.json, staff.json (kontent), site.ts (aloqa ma'lumotlari)
src/components/      sahifa bo'limlari, dialog, admin formalari
src/hooks/           usePosts, useAuth, useScrollSpy, useSubmit
src/pages/           Home, Login, Admin (lazy-load)
```
