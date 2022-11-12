import * as React from 'react';

export default function Index() {
  return (
    <main className='flex flex-col min-h-full justify-center text-center py-0 px-8 bg-gray-100 text-gray-800'>
      <div className='font-semibold text-5xl'>
        Hello, I'm Joep Kockelkorn! <span className='inline-block animate-wiggle'>👋</span>
      </div>
      <div className='font-mono text-3xl mt-4 mx-0'>
        Full Stack Dev && Front-end fanatic
      </div>
      <div className='mt-8 flex flex-row justify-center flex-wrap gap-2'>
        <a
          className='flex items-center justify-center h-16 w-16 hover:text-orange-400 group'
          target='_blank'
          href='https://twitter.com/joepkockelkorn'
        >
          <i className='transform transition-all group-hover:scale-125 text-5xl p-2 fab fa-twitter'></i>
        </a>
        <a
          className='flex items-center justify-center h-16 w-16 hover:text-orange-400 group'
          target='_blank'
          href='https://www.linkedin.com/in/joepkockelkorn'
        >
          <i className='transform transition-all group-hover:scale-125 text-5xl p-2 fab fa-linkedin'></i>
        </a>
        <a
          className='flex items-center justify-center h-16 w-16 hover:text-orange-400 group'
          target='_blank'
          href='https://github.com/joepkockelkorn'
        >
          <i className='transform transition-all group-hover:scale-125 text-5xl p-2 fab fa-github'></i>
        </a>
        <a
          className='flex items-center justify-center h-16 w-16 hover:text-orange-400 group'
          target='_blank'
          href='https://stackoverflow.com/users/5475829/joep-kockelkorn'
        >
          <i className='transform transition-all group-hover:scale-125 text-5xl p-2 fab fa-stack-overflow'></i>
        </a>
      </div>
    </main>
  );
}
