import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button, ButtonProps } from './ui/button';

type SortButtonProps<TData, TValue> = ButtonProps & {
  column: Column<TData, TValue>;
};
export const SortButton = <TData, TValue>({ column, ...props }: SortButtonProps<TData, TValue>) => {
  return (
    <Button
      className='rounded-xs size-9'
      variant='ghost'
      {...props}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      <ArrowUpDown />
    </Button>
  );
};
