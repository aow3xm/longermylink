import { db } from '@/lib/db';
import { link } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  const path = pathname.split('/l/')[1];

  const p = await db.query.link.findFirst({
    where: eq(link.path, path),
  });

  if (!p) return NextResponse.json(null, { status: 404 });
  return NextResponse.redirect(p.original, {
    status: 302,
    headers: {
      'Referrer-Policy': 'no-referrer',
    },
  });
};
