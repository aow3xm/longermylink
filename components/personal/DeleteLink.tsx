import { DeleteLinkData, deleteLinkSchema } from '@/lib/schema/personal';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from '../SubmitButton';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';

type DeleteLinkProps = {
  id: number;
};
export const DeleteLink: React.FC<DeleteLinkProps> = ({ id }) => {
  const t = useTranslations('Profile.LinkTable');
  const queryClient = useQueryClient();
  const method = useForm<DeleteLinkData>({ resolver: valibotResolver(deleteLinkSchema), defaultValues: { id } });
  const {
    handleSubmit,
  } = method;

  const handleDeleteLink = handleSubmit(async data => {
    const { deleteLink } = await import('@/actions/link');
    const { toast } = await import('sonner');
    const response = await deleteLink(data);
    if (response?.serverError) {
      toast.error(response.serverError);
      return;
    }
    toast.success('Link has been deleted!');
    queryClient.invalidateQueries({queryKey: ['links']});
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onSelect={e => e.preventDefault()}
          variant='destructive'
          className='rounded-none h-9'
        >
          Delete link
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent className='rounded-none'>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('deleteLinkTitle')}</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className='rounded-none'>{t('deleteLinkCancel')}</AlertDialogCancel>
          <FormProvider {...method}>
            <form onSubmit={handleDeleteLink}>
              <SubmitButton className='rounded-none'>{t('deleteLinkConfirm')}</SubmitButton>
            </form>
          </FormProvider>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
