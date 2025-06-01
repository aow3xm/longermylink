'use client'

import { GetLinksResponse } from '@/app/api/links/route';
import { Link } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import ky from 'ky';
export const useInfiniteLinks = () => {
  const { data: result, isFetching, isError, fetchNextPage } = useInfiniteQuery<GetLinksResponse, Error, Link[], string[], number | undefined>({
    queryKey: ['links'],
    queryFn: async ({ pageParam }) => {
      const url = `/api/links${pageParam ? `?next=${pageParam}` : ''}`;
      const response = await ky.get<GetLinksResponse>(url)
      return response.json();
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.data?.next,
    select: (data)=> data.pages.flatMap(page=>page.data?.links ?? []) 
  });


  return {
    result,
    isFetching,
    isError,
    fetchNextPage,
  }
};
