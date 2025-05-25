import Image from 'next/image';
import ShapeBackground from '@/public/assets/v882-kul-53.jpg'
type AuthLayoutProps = {
  children: React.ReactNode;
};
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <div className='relative w-full h-[calc(100vh-3.5rem)] max-w-5xl mx-auto border-x'>
    <Image
      src={ShapeBackground}
      fill
      alt='shape background'
      className='z-10 hidden object-cover opacity-50 dark:block'
    />
    
    <section className='relative z-10 grid h-full px-2 place-items-center'>
      <div className='grid items-start w-full grid-cols-1 gap-8 sm:grid-cols-2'>
        <div className='hidden col-span-1 mx-auto sm:block'>
          <Dummy />
        </div>
        <div className='col-span-1 mx-auto'>{children}</div>
      </div>
    </section>
  </div>
);

const Dummy = () => (
  <div className='max-w-sm'>
    <h1 className='text-4xl font-bold'>Get started</h1>
    <p className='text-muted-foreground'>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptas eum, eaque corrupti iusto praesentium fuga quae commodi. Voluptatem porro commodi impedit libero voluptatum labore soluta mollitia, officiis veritatis! Quibusdam,
      explicabo!
    </p>
  </div>
);

export default AuthLayout;
