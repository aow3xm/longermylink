'use client';

import { paths } from '@/config/page';
import { Link } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { Ellipsis } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { DeleteLink } from './DeleteLink';
export const useLinkColumns = (): ColumnDef<Link>[] => {
  const t = useTranslations('Profile.LinkTable');
  const locale = useLocale();
  return [
    {
      accessorKey: 'original',
      header: () => <span>{t('original')}</span>,
      enableResizing: false,
      cell: ({ row }) => <a className='inline-block max-w-xs truncate'>{row.original.original}</a>,
    },
    {
      accessorKey: 'path',
      header: () => <span className='block text-center'>{t('path')}</span>,
      cell: ({ row }) => {
        const path = `${process.env.NEXT_PUBLIC_BASE_URL}${paths.l}/${row.original.path}`;
        return (
          <div className='flex justify-center'>
            <CopyToolTip
              value={path}
              label={t('path')}
            >
              <a
                href={path}
                target='_blank'
                rel='noreferrer noopener'
                className='inline-block max-w-sm text-center truncate hover:underline'
              >
                {path}
              </a>
            </CopyToolTip>
          </div>
        );
      },
    },
    {
      accessorKey: 'createdAt',
      header: () => <span className='block text-center'>{t('createdAt')}</span>,
      cell: ({ row }) => {
        const now = format(row.original.createdAt, 'dd/MM/yyyy HH:mm:ss', { locale: locale === 'vi' ? vi : enUS });
        return <span className='block text-center'>{now}</span>;
      },
    },
    {
      id: 'actions',
      header: ()=> <span className='block text-right opacity-0'>Actions</span>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='size-9 rounded-xs'
              >
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className='rounded-none bg-background p-0 mr-[18px] mt-1'>
              <DeleteLink id={row.original.id} />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

type CopyToolTipProps = React.ComponentProps<'div'> & {
  label: string;
  value: string;
  children: React.ReactNode;
};
const CopyToolTip: React.FC<CopyToolTipProps> = ({ value, label, children, ...props }) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };
  return (
    <Tooltip delayDuration={1}>
      <TooltipTrigger asChild>
        <span className='cursor-pointer'>{children}</span>
      </TooltipTrigger>
      <TooltipContent
        className='pointer-events-auto'
        side='top'
        align='start'
        {...props}
      >
        <span
          className='text-sm cursor-pointer'
          onClick={handleCopy}
        >
          Copy {label.toLowerCase()}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};
