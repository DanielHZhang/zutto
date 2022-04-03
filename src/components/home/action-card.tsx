import {JSX, JSXElement, splitProps} from 'solid-js';

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
};

export const ActionCard = (props: Props): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['title', 'description']);
  return (
    <div
      class='flex justify-between bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-4 max-w-xs cursor-pointer'
      {...htmlProps}
    >
      <div class='flex'>
        <div class='w-10 h-10' />
        <div class='flex flex-col'>
          <h1 class='font-medium'>{ownProps.title}</h1>
          <div class='text-slate-400'>{ownProps.description}</div>
        </div>
      </div>
      <div>
        <span>+</span>
      </div>
    </div>
  );
};
