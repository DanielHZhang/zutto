import {JSXElement} from 'solid-js';

type Props = {
  type: '';
};

export const ActionCard = (props: Props): JSXElement => {
  return (
    <div class='flex justify-between bg-slate-800 rounded-lg p-4'>
      <div class='flex flex-col'>
        <div>Open Database</div>
        <div>View and visualize</div>
      </div>
      <div>
        <span>+</span>
      </div>
    </div>
  );
};
