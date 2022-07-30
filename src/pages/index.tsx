import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { z, ZodIssue } from 'zod';
import { trpc } from '../utils/trpc';




type Error = {
  errors: {successful : boolean, error?: ZodIssue[]}
}
const Home: NextPage = () => {
  const [slug, setSlug] = useState('');
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const createUrl = trpc.useMutation(['createUrl']);
  const [error, setError] = useState<Error>({errors: {successful: true}});
  const foundSlugs = trpc.useQuery(['isSlug', { slug: slug }], {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
  const location = useRef('');
  // let location: string;

  const formSchema = z.object({
    url: z
    .string({
      required_error: 'URL is required.',
    })
    .url({ message: 'Invalid URL' }),
    slug: z.string({ required_error: 'Slug is required.' })
    .min(1, {message: 'Slug must not be empty'})
    .max(20, {message: 'Slug must be less than 20 characters'})
    .refine(() => foundSlugs .data?.found !== true, {
      message: 'Slug is already taken',
    })
  })
  

  useEffect(() => {
    location.current = window.location.href;
  }, []);


  const updateErrors = (url: string, slug: string) => {
    formSchema.safeParseAsync({ url: url, slug: slug }).then((data ) => {
      console.log('working', data)
      setError({errors: {successful: data.success, error: data.success ? undefined : data.error.issues}})

    })
  }


  const handleRandomClick = () => {

    const randomSlug =
      Math.random().toString(36).substring(2, 5) +
      Math.random().toString(36).substring(2, 5);
    setSlug(randomSlug);
    if(!error.errors.successful) {
    updateErrors(url, randomSlug);
    }
  };
  const handleSubmit = () => {
    console.log('Submit!');
    foundSlugs.refetch();

    const formCheck = formSchema.safeParse({url, slug});
    if (formCheck.success) {
      createUrl.mutate({ slug: slug, url: url });
      foundSlugs.refetch();

      return;
    }
    console.log(formCheck.error.issues);
    setError({errors: {successful: false, error: formCheck.error.issues}})
    console.log('errors', error);
  };

  if (createUrl.status === 'success') {
    return (
      <div className='flex items-center justify-center w-screen h-screen bg-slate-800'>
        <div className='inline-flex flex-col space-y-2'>
          <div className='flex'>
            <input
              type={'slug'}
              className='px-2 py-1 font-bold text-red-500 border-2 border-r-0 border-gray-900 rounded-l placeholder:opacity-30 placeholder:font-normal bg-slate-800 focus:outline-none hover:ring-red-500 hover:ring-2 focus:ring-red-500 focus:ring-2'
              onChange={() => {}}
              placeholder='Enter your slug here.'
              value={`${location.current}${slug}`}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${location.current}${slug}`);
                setCopied(true);
                console.log('location', location);
              }}
              className='p-1 font-semibold text-gray-900 bg-red-500 border-2 border-gray-900 rounded-r-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400'
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <button
            type='submit'
            onClick={() => {
              createUrl.reset();
            }}
            className='p-1 font-semibold text-gray-900 bg-red-500 border-2 border-gray-900 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400'
          >
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center w-screen h-screen bg-slate-800'>
      <div className='inline-flex flex-col space-y-2'>
        <div className='flex space-x-2'>
          <span className='self-center text-lg font-medium text-red-500'>
          {location.current}
          </span>
          <input
            type={'slug'}
            className='px-2 py-1 font-bold text-red-500 border-2 border-gray-900 rounded placeholder:opacity-30 placeholder:font-normal bg-slate-800 focus:outline-none hover:ring-red-500 hover:ring-2 focus:ring-red-500 focus:ring-2'
            onInput={(e) => {
              setSlug(e.currentTarget.value)
              if(!error.errors.successful) {
              updateErrors(url,e.currentTarget.value)
              }
            }}
            placeholder='Enter your slug here.'
            value={slug}
          />
          <button
            onClick={handleRandomClick}
            className='p-1 font-semibold text-gray-900 bg-red-500 border-2 border-gray-900 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400'
          >
            Random
          </button>
        </div>
        <input
          type={'url'}
          className='px-2 py-1 font-bold text-red-500 border-2 border-gray-900 rounded placeholder:opacity-30 placeholder:font-normal bg-slate-800 focus:outline-none hover:ring-red-500 hover:ring-2 focus:ring-red-500 focus:ring-2'
          // onPaste={handleUrl}
          placeholder='Enter your URL here.'
          onInput={(e) => {
            setUrl(e.currentTarget.value);
            if(!error.errors.successful) {
              updateErrors(e.currentTarget.value, slug);
              }
            
          }}
          value={url}
        />
        {error.errors.error
          ? error.errors.error.map((issue, index) => (
              <div
                key={index}
                className='bg-[#E03131] bg-opacity-20   py-3 px-4  rounded  divide-rose-600'
              >
                <div className='flex '>
                  <div className='items-center content-center justify-start w-5 h-5 mr-4'>
                    <BiErrorCircle className='leading-none text-red-300' size={'1.25rem'} />
                  </div>
                  <div className='flex flex-col '>
                    <div className='box-border flex items-center mb-3 '>
                      <span className='text-lg font-bold leading-none text-red-300'>
                        Error
                      </span>
                    </div>
                    <span className='font-normal text-white '>
                      {issue.message}
                    </span>
                  </div>
                </div>
              </div>
            ))
          : null}
        <button
          type='submit'
          onClick={handleSubmit}
          className='p-1 font-semibold text-gray-900 bg-red-500 border-2 border-gray-900 rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400'
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Home;

