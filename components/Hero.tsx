'use client';

import { FormProvider, useForm } from 'react-hook-form';
import { SubmitButton } from './SubmitButton';
import { Input } from './ui/input';

export const Hero: React.FC = () => {
  const method = useForm();
  const { handleSubmit } = method

  const handleMakeLink = handleSubmit(async ()=>{
    await new Promise((resolve)=> setTimeout(resolve, 2000))
  })
  return (
    <div className='relative max-w-5xl h-[calc(100vh-3.5rem)] mx-auto border-x overflow-hidden antialiased flex flex-col items-center justify-center px-2'>
      <GridBackground />

      <div className='relative z-10 w-full p-4 pt-20 mx-auto max-w-7xl md:pt-0'>
        <h1 className='text-4xl font-bold text-center text-transparent bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text md:text-7xl'>
          Spotlight <br /> is the new trend.
        </h1>
        <p className='max-w-lg mx-auto mt-4 text-base font-normal text-center text-neutral-300'>
          Spotlight effect is a great way to draw attention to a specific part of the page. Here, we are drawing the attention towards the text section of the page. I don&apos;t know why but I&apos;m running out of copy.
        </p>
      </div>

      <FormProvider {...method}>
        <form onSubmit={handleMakeLink} className='space-y-2 w-xs sm:w-sm'>
          <Input placeholder='Paste your short link here' />
          <SubmitButton className='w-full'>Make it long</SubmitButton>
        </form>
      </FormProvider>
    </div>
  );
};

const GridBackground: React.FC = () => (
  <div className='absolute inset-0 hidden pointer-events-none select-none dark:block'>
    <svg
      className='w-full h-full'
      xmlns='http://www.w3.org/2000/svg'
    >
      <defs>
        <pattern
          id='grid'
          width='50'
          height='50'
          patternUnits='userSpaceOnUse'
        >
          <path
            d='M 50 0 L 0 0 0 50'
            fill='none'
            stroke='#171717'
            strokeWidth='1'
          />
        </pattern>
      </defs>
      <rect
        width='100%'
        height='100%'
        fill='url(#grid)'
      />
    </svg>
  </div>
);
