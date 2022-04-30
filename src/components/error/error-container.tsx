import type {JSXElement} from 'solid-js';
import {createEffect} from 'solid-js';
import DbErrorIcon from 'src/components/icons/db-error.svg';

type Props = {
  message: string;
};

export const ErrorContainer = (props: Props): JSXElement => {
  createEffect(() => {
    console.error('ErrorContainer caught:\n', props);
  });

  return (
    <div class='flex items-center justify-center pt-30'>
      <div class='flex flex-col p-8 rounded-xl bg-slate-900 max-w-lg shadow-xl'>
        <div class='flex justify-center'>
          <DbErrorIcon width='7rem' height='7rem' />
        </div>
        <h1 class='text-3xl font-bold text-center text-blue-400'>Oh no!</h1>
        <h2 class='text-xl font-semibold text-center mb-4 text-red-400'>Something went wrong...</h2>
        <div class='bg-slate-800 font-mono p-4 rounded-xl shadow-lg'>
          <div>{props.message}</div>
        </div>
      </div>
    </div>
  );
};
