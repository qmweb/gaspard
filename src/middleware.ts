import { betterFetch } from '@better-fetch/fetch';
import { NextRequest, NextResponse } from 'next/server';

import { authClient } from '../lib/auth-client';

type Session = typeof authClient.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    '/api/auth/get-session',
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get('cookie') || '', // Forward the cookies from the request
      },
    },
  );

  if (!session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], // Apply middleware to specific routes
};
