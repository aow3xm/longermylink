'use client';

import { useTranslations } from 'next-intl';
import { GenerateLinkForm } from './GenerateLinkForm';
export const Hero: React.FC = () => {
  const t = useTranslations('HomePage.Hero');
  return (
    <div className='relative max-w-5xl h-[calc(100vh-3.5rem)] mx-auto border-x overflow-hidden antialiased flex flex-col items-center justify-center px-2'>
      <GridBackground />

      <div className='relative z-10 w-full p-4 pt-20 mx-auto max-w-7xl md:pt-0'>
        <h1 className='max-w-3xl mx-auto text-3xl font-bold text-center text-black md:text-5xl lg:text-6xl xl:text-7xl dark:text-transparent dark:bg-red-400 dark:bg-clip-text dark:bg-linear-to-br dark:from-[#747474] dark:to-[#ffffff]'>
          {t.rich('heading', {
            br: () => <br />,
            del: chunks => <span className='dark:decoration-background text-black line-through dark:text-transparent dark:bg-clip-text dark:bg-linear-to-br dark:from-[#747474] dark:to-[#ffffff]'>{chunks}</span>
          })}
        </h1>
      </div>

      <GenerateLinkForm />
    </div>
  );
};

const GridBackground: React.FC = () => (
  <div className='absolute inset-0 hidden pointer-events-none select-none dark:block'>
    <svg
      className='w-full h-full'
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      height='100%'
      preserveAspectRatio='none'
    >
      <pattern
        id='grid'
        width='14'
        height='14'
        patternUnits='userSpaceOnUse'
        x='-1'
        y='-1'
      >
        <path
          d='M 14 0 L 0 0 0 14'
          fill='none'
          stroke='#171717'
          strokeWidth='1'
          vectorEffect='non-scaling-stroke'
        />
      </pattern>
      <rect
        width='100%'
        height='100%'
        fill='url(#grid)'
      />
    </svg>
  </div>
);
