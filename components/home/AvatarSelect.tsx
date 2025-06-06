'use client';

import { authClient } from '@/lib/auth/client';
import { UpdateAvatarData, updateAvatarSchema } from '@/lib/schema/personal';
import { cn } from '@/lib/utils';
import { capitalizeName } from '@/utils';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from '../SubmitButton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

const avatars = [
  { id: 1, src: '/avatars/funEmoji-1748177407752.webp' },
  { id: 2, src: '/avatars/funEmoji-1748177400715.webp' },
  { id: 3, src: '/avatars/funEmoji-1748177396212.webp' },
  { id: 4, src: '/avatars/funEmoji-1748177393107.webp' },
  { id: 5, src: '/avatars/funEmoji-1748177384745.webp' },
];

export const AvatarSelect = () => {
  const t = useTranslations('HomePage.AvatarSelect');
  const { data, isPending, refetch } = authClient.useSession();
  const user = data?.user;
  const userAvatar = user?.image;
  const userFallback = capitalizeName(data?.user.name);

  const [selectedAvatar, setSelectedAvatar] = useState(userFallback);
  const [open, setOpen] = useState(true);

  const form = useForm<UpdateAvatarData>({
    resolver: valibotResolver(updateAvatarSchema),
    defaultValues: { link: userFallback },
  });

  const updateAvatar = async (link: string, showSuccess = true) => {
    const { toast } = await import('sonner');
    const { updateAvatar } = await import('@/actions/avatar');

    const response = await updateAvatar({ link });
    if (response?.serverError) {
      toast.error(response.serverError);
      return;
    }

    if (showSuccess) toast.success(t('toast'));
    setOpen(false);
    refetch();
  };

  const handleSelectAvatar = (link: string) => {
    form.setValue('link', link);
    setSelectedAvatar(link);
  };

  const handleSkip = () => updateAvatar(userFallback, false);
  const handleSubmit = form.handleSubmit(data => updateAvatar(data.link));

  const avatarClassName = 'col-span-1 p-2 transition-all cursor-pointer size-26 hover:ring-2 hover:ring-primary';

  if (!isPending && !user && !userAvatar) return null;
  if (!isPending && user && !userAvatar) {
    return (
      <Dialog
        open={open}
        onOpenChange={e => !e && handleSkip()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
          </DialogHeader>

          <div className='grid grid-cols-2 gap-4 place-items-center sm:grid-cols-3'>
            <Avatar
              className={cn(avatarClassName, selectedAvatar === userFallback && 'ring-2')}
              onClick={() => handleSelectAvatar(userFallback)}
            >
              <AvatarFallback>{userFallback}</AvatarFallback>
            </Avatar>

            {avatars.map(avatar => (
              <Avatar
                key={avatar.id}
                className={cn(avatarClassName, selectedAvatar === avatar.src && 'ring-2')}
                onClick={() => handleSelectAvatar(avatar.src)}
              >
                <AvatarImage src={avatar.src} className='scale-120'/>
              </Avatar>
            ))}
          </div>

          <FormProvider {...form}>
            <form
              className='flex gap-2'
              onSubmit={handleSubmit}
            >
              <Button
                className='w-1/2'
                variant='secondary'
                type='button'
                onClick={handleSkip}
              >
                {t('skip')}
              </Button>
              <SubmitButton
                loader={false}
                className='w-1/2'
              >
                {t('select')}
              </SubmitButton>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    );
  }
};
