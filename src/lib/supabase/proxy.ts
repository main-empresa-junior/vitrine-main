import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import type { Database } from '@/types/database';

import { supabaseEnv } from './env';

const DASHBOARD_PATH = '/dashboard';
const LOGIN_PATH = '/dashboard/login';

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Nada entre createServerClient e getClaims: isso dessincroniza a sessão e desloga ao acaso.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);

  const { pathname, search } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;

  if (!isSignedIn && !isLoginPage) {
    return redirectKeepingCookies(request, response, LOGIN_PATH, { next: pathname + search });
  }

  if (isSignedIn && isLoginPage) {
    return redirectKeepingCookies(request, response, DASHBOARD_PATH);
  }

  return response;
}

function redirectKeepingCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  searchParams: Record<string, string> = {},
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  Object.entries(searchParams).forEach(([key, value]) => url.searchParams.set(key, value));

  const redirect = NextResponse.redirect(url);
  // Leva junto os cookies renovados, senão navegador e servidor ficam com sessões diferentes.
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
