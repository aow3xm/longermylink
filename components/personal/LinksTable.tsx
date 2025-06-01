'use client';

import { useInfiniteLinks } from '@/hooks/use-infinite-links';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { DataTable } from '../DataTable';
import { Skeleton } from '../ui/skeleton';
import { useLinkColumns } from './link-columns';
export const LinksTable: React.FC = () => {
  const { result, isFetching, isError, fetchNextPage } = useInfiniteLinks();
  const columns = useLinkColumns();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isFetching) {
      fetchNextPage();
    }
  }, [inView, isFetching, fetchNextPage]);
  return (
    <section className='max-w-5xl border-x mx-auto min-h-[calc(100vh-3.5rem)]'>
      {result && (
        <>
          <DataTable
            data={result}
            columns={columns}
          />
          <div
            ref={ref}
            className='h-10 sr-only'
          />
          {isFetching && <LoadingSkeleton />}
          {isError && <p>Error fetching links</p>}
        </>
      )}
    </section>
  );
};

const LoadingSkeleton = () => {
  return Array.from({ length: 4 }).map((_, index) => (
    <div
      key={index}
      className='grid items-center w-full gap-5 px-2 grid-cols-22 h-[3.277rem] border-y'
    >
      <Skeleton className='w-full h-3 col-span-7 rounded-xs' />
      <Skeleton className='w-full h-3 col-span-9 mx-auto rounded-xs' />
      <Skeleton className='w-full h-3 col-span-5 ml-auto rounded-xs' />
      <div className='size-3 col-span-1 flex gap-0.5'>
        <Skeleton className='rounded-full size-1' />
        <Skeleton className='rounded-full size-1' />
        <Skeleton className='rounded-full size-1' />
      </div>
    </div>
  ));
};
