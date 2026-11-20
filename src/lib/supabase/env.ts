import { z } from 'zod';

const envSchema = z.object({
  url: z.url(),
  publishableKey: z.string().min(1),
});

// Referência literal a cada variável: o Next só embute no cliente o que aparece escrito assim.
const parsed = envSchema.safeParse({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

if (!parsed.success) {
  throw new Error(
    'Missing or invalid Supabase environment variables. Copy .env.example to .env.local and fill in the values.',
  );
}

export const supabaseEnv = parsed.data;
