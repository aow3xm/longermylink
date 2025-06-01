'use client';

import { authClient } from '@/lib/auth/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { CopyButton } from './CopyButton';
import { Input } from './ui/input';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { paths } from '@/config/page';

type ShowResultProps = {
  result: string;
};
export const ShowResult: React.FC<ShowResultProps> = ({ result }) => {
  const { data, isPending } = authClient.useSession();
  const user = !isPending && data?.user;
  return (
    <Dialog defaultOpen={true}>
      <DialogContent>
        <DialogHeader>
            <DialogTitle>Your link is ready ✨</DialogTitle>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div className='flex gap-2'>
          <Input
            className='font-mono'
            value={result}
            readOnly
          />
          <CopyButton text={result} />
        </div>

        <DialogFooter>
          {!user && (
            <Button asChild>
              <Link className='group' href={paths.auth.register}>
                Sign up to save your link <ChevronRight className='duration-100 group-hover:translate-x-0.5'/>
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
