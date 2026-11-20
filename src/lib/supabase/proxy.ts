import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

import { supabaseEnv } from './env';

const DASHBOARD_PATH = '/dashboard';
const LOGIN_PATH = '/dashboard/login';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseEnv.url, supabaseEnv.publishableKey, {
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

  // Do not add code between createServerClient and getClaims:
  // it can desync the session and sign users out at random.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;

  if (!isSignedIn && !isLoginPage) {
    return redirectKeepingCookies(request, response, LOGIN_PATH, { next: pathname });
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
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = '';
  Object.entries(searchParams).forEach(([key, value]) => url.searchParams.set(key, value));

  const redirect = NextResponse.redirect(url);
  // Carry over refreshed session cookies, otherwise the browser and server get out of sync.
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
