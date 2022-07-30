import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('PathName', request.nextUrl.pathname);
  const slug = request.nextUrl.pathname.split('/')[1];

  console.log('Slug', slug);

  if (!slug || typeof slug !== 'string') {
    return;
  }

  const data = await fetch(`${request.nextUrl.origin}/api/${slug}`);
  if (data.status === 404) {
    return NextResponse.redirect(request.nextUrl.origin);
  }
  const json = await data.json();
  if (json?.url) {
    return NextResponse.redirect(json.url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:slug',
};

