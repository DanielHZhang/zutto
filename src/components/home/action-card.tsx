import OpenIcon from 'iconoir/icons/open-in-window.svg';
import PlusIcon from 'iconoir/icons/plus.svg';
import {JSX, JSXElement, splitProps} from 'solid-js';

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
};

export const ActionCard = (props: Props): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['title', 'description']);
  return (
    <div
      class='flex justify-between bg-slate-700 hover:bg-slate-600 transition-colors shadow-md rounded-lg p-4 max-w-xs cursor-pointer'
      {...htmlProps}
    >
      <div class='flex space-x-4'>
        <div class='flex justify-center items-center'>
          <OpenIcon />
        </div>
        <div class='flex flex-col'>
          <h1 class='font-medium'>{ownProps.title}</h1>
          <div class='text-slate-400'>{ownProps.description}</div>
        </div>
      </div>
      <div class='flex justify-center items-center'>
        <PlusIcon width='32' height='32' />
      </div>
    </div>
  );
};
