const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  throw new Error(
    'Missing Supabase environment variables. Copy .env.example to .env.local and fill in the values.',
  );
}

export const supabaseEnv = { url, publishableKey };
