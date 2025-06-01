'use client';

import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';
import { Button, ButtonProps } from './ui/button';

type CopyButtonProps = ButtonProps & {
  text: string;
};
export const CopyButton: React.FC<CopyButtonProps> = ({ text, ...props }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = async () => {
    await window.navigator.clipboard.writeText(text)
    setCopied(true);

    setTimeout(()=> setCopied(false), 1500)
  };
  return (
    <Button
      variant='outline'
      className='size-9'
      {...props}
      onClick={handleCopy}
    >
      {copied ? <Check/> : <Clipboard/>}
    </Button>
  );
};
