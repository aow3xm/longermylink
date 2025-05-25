import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { link } from '@/lib/db/schema';
export async function GET(req: NextRequest) {
  const subdomain = req.headers.get('x-subdomain');

  if (!subdomain) {
    return new NextResponse('Missing subdomain', { status: 400 });
  }

  const record = await db.query.link.findFirst({
    where: eq(link.from, subdomain),
  });

  if (!record) {
    return new NextResponse('Not found', { status: 404 });
  }

  const url = new URL(record.to);

  return NextResponse.redirect(url.toString(), 302);
}