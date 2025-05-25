'use client';

import { authClient } from '@/lib/auth/client';
import { UpdateAvatarData, updateAvatarSchema } from '@/lib/schema/personal';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from './SubmitButton';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
const avatars = [
  { id: 1, src: '/avatars/funEmoji-1748177407752.webp' },
  { id: 2, src: '/avatars/funEmoji-1748177400715.webp' },
  { id: 3, src: '/avatars/funEmoji-1748177396212.webp' },
  { id: 4, src: '/avatars/funEmoji-1748177393107.webp' },
  { id: 5, src: '/avatars/funEmoji-1748177384745.webp' },
];

const capitalizeName = (name?: string) => {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length <= 1) return name.charAt(0).toUpperCase();

  const first = words[0].charAt(0);
  const last = words[words.length - 1].charAt(0);

  return (first + last).toUpperCase();
};

export const AvatarSelect = () => {
  const avatarClassName = 'col-span-1 p-2 transition-all cursor-pointer size-26 hover:ring-2 hover:ring-primary';
  const [avatarSrc, setAvatarSrc] = useState<string>('default');
  const [open, setOpen] = useState<boolean>(true);

  const { data, isPending } = authClient.useSession();
  const fullName = data?.user.name;
  const userAvatar = data?.user.image;

  const method = useForm<UpdateAvatarData>({ resolver: valibotResolver(updateAvatarSchema), defaultValues: { link: 'default' } });
  const { handleSubmit, setValue } = method;

  if (userAvatar) return null;

  const handleSelectAvatar = (link: string) => {
    setValue('link', link);
    setAvatarSrc(link);
  };

  const handleSkip = async () => {
    setOpen(false);
    const { toast } = await import('sonner');
    const { updateAvatar } = await import('@/actions/avatar');
    const response = await updateAvatar({ link: 'default' });
    if (response?.serverError) {
      toast.error(response.serverError);
    }
  };

  const handleUpdateAvatar = handleSubmit(async data => {
    const { toast } = await import('sonner');
    const { updateAvatar } = await import('@/actions/avatar');

    const response = await updateAvatar(data);
    if (response?.serverError) {
      toast.error(response.serverError);
      return;
    }
    toast.success('Avatar updated successfully!');
    setOpen(false);
  });

  return (
    <>
      {data && !isPending && (
        <Dialog
          open={open}
          onOpenChange={e => !e && handleSkip()}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select your avatar</DialogTitle>
            </DialogHeader>

            <div className='grid grid-cols-2 gap-4 place-items-center sm:grid-cols-3'>
              <Avatar
                className={cn(avatarClassName, avatarSrc === 'default' ? 'ring-2' : '')}
                onClick={() => handleSelectAvatar('default')}
              >
                <AvatarFallback>{capitalizeName(fullName)}</AvatarFallback>
              </Avatar>

              {avatars.map(avatar => (
                <Avatar
                  key={avatar.id}
                  className={cn(avatarClassName, avatarSrc === avatar.src ? 'ring-2' : '')}
                  onClick={() => handleSelectAvatar(avatar.src)}
                >
                  <AvatarImage src={avatar.src} />
                </Avatar>
              ))}
            </div>

            <FormProvider {...method}>
              <form
                className='flex gap-2'
                onSubmit={handleUpdateAvatar}
              >
                <Button
                  className='w-1/2'
                  variant='secondary'
                  type='button'
                  onClick={handleSkip}
                >
                  No, let me in
                </Button>
                <SubmitButton
                  loader={false}
                  className='w-1/2'
                >
                  Select my avatar
                </SubmitButton>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
