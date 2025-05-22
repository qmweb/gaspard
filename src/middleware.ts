import { betterFetch } from '@better-fetch/fetch';
import { authClient } from '@lib/auth-client';
import { NextRequest, NextResponse } from 'next/server';

type Session = typeof authClient.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    },
  );

  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
