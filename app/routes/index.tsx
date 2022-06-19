import * as React from 'react';

export default function Index() {
  return (
    <main className='flex flex-col min-h-full justify-center text-center py-0 px-8 bg-gray-100 text-gray-600'>
      <div className='font-reem font-semibold text-4xl md:text-6xl'>
        Hello, I'm Joep Kockelkorn!
      </div>
      <div className='font-thin text-2xl md:text-4xl mt-4 mx-0'>
        Full Stack Dev | Front-end fanatic
      </div>
      <div className='icons-social'>
        <a className='hover:text-yellow-500' target='_blank' href='https://twitter.com/joepkockelkorn'>
          <i className='text-3xl md:text-5xl p-2 fab fa-twitter'></i>
        </a>
        <a className='hover:text-yellow-500' target='_blank' href='https://www.linkedin.com/in/joepkockelkorn'>
          <i className='text-3xl md:text-5xl p-2 fab fa-linkedin'></i>
        </a>
        <a className='hover:text-yellow-500' target='_blank' href='https://medium.com/@joepkockelkorn'>
          <i className='text-3xl md:text-5xl p-2 fab fa-medium'></i>
        </a>
        <a className='hover:text-yellow-500' target='_blank' href='https://github.com/joepkockelkorn'>
          <i className='text-3xl md:text-5xl p-2 fab fa-github'></i>
        </a>
        <a
          className='hover:text-yellow-500'
          target='_blank'
          href='https://stackoverflow.com/users/5475829/joep-kockelkorn'
        >
          <i className='text-3xl md:text-5xl p-2 fab fa-stack-overflow'></i>
        </a>
      </div>
    </main>
  );
}
