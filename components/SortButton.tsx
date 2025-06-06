import { ArrowUpDown } from 'lucide-react'
import { Button, ButtonProps } from './ui/button'
import { Column } from '@tanstack/react-table'

type SortButtonProps = ButtonProps & {
    column: Column<any, unknown>
}
export const SortButton: React.FC<SortButtonProps> = ({column, ...props}) => {
  return (
    <Button className='rounded-xs size-9' variant='ghost' {...props} onClick={()=> column.toggleSorting(column.getIsSorted() === 'asc')}>
        <ArrowUpDown/>
    </Button>
  )
}
