import { LinksTable } from '@/components/personal/LinksTable';
import { auth } from '@/lib/auth/server';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const generateMetadata = async (): Promise<Metadata> => {
  const session = await auth.api.getSession({headers: await headers()})

  return {
    title: session?.user.name,
  }
}
const ProfilePage: React.FC = () => {
  return <LinksTable/>
};

export default ProfilePage;
