type AuthLayoutProps = {
  children: React.ReactNode;
};
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <section className='h-[calc(100vh-3.5rem)] grid place-items-center max-w-5xl mx-auto border-x'>
    <div className='grid items-start w-full grid-cols-1 gap-8 sm:grid-cols-2'>
      <div className='hidden col-span-1 mx-auto sm:block'>
        <Dummy />
      </div>
      <div className='col-span-1 mx-auto'>
        {children}
      </div>
    </div>
  </section>
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
