import type {JSXElement} from 'solid-js';

type Props = {
  message: string;
};

export const ErrorContainer = (props: Props): JSXElement => {
  return (
    <div class='flex items-center justify-center flex-grow-1'>
      <div class='flex flex-col p-8 rounded-xl bg-slate-500'>
        <h1 class='text-3xl'>Something went wrong...</h1>
      </div>
    </div>
  );
};
