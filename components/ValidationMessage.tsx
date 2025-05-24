import { AlertCircle, AlertOctagon, AlertTriangle } from 'lucide-react';

type ValidationErrorMsgProps = {
  msg: string;
};

export const ValidationErrorMsg: React.FC<ValidationErrorMsgProps> = ({ msg }) => (
  <p className='flex items-center gap-1 text-xs text-destructive'>
    <AlertCircle className='size-3' />
    {msg}
  </p>
);
