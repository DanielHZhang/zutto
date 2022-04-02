import {JSXElement} from 'solid-js';

type Props = {
  type: '';
};

export const ActionCard = (props: Props): JSXElement => {
  return (
    <div class='flex justify-between bg-slate-800 rounded-lg p-4 max-w-xs cursor-pointer'>
      <div class='flex'>
        <div class='w-10 h-10' />
        <div class='flex flex-col'>
          <h1 class='font-medium'>Open Database</h1>
          <div class='text-slate-400'>View and visualize</div>
        </div>
      </div>
      <div>
        <span>+</span>
      </div>
    </div>
  );
};
