import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { link } from '@/lib/db/schema';
import { Link } from '@/types';
import { and, desc, eq, lt } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export type GetLinksResponse = {
  error?: string;
  data?: {
    links: Link[];
    next: number | null;
  };
};

const LIMIT = 10;
export const GET = async (req: NextRequest): Promise<NextResponse<GetLinksResponse>> => {
  const nextParam = req.nextUrl.searchParams.get('next');
  let nextCursor: number | null = null;
  if(nextParam !== null){
    nextCursor = nextParam.trim() === '' || Number.isNaN(Number(nextParam)) ? null : Number(nextParam);
  }
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const condition = nextCursor ? and(eq(link.userId, session.user.id), lt(link.id, nextCursor)) : eq(link.userId, session.user.id)

  try {
    const links = await db.query.link.findMany({
      where: condition,
      limit: LIMIT,
      orderBy: desc(link.id),
    });

    const next = links.length ? links[links.length - 1].id : null;
    return NextResponse.json({ data: { links, next } });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
