import PlusIcon from 'iconoir/icons/plus.svg';
import {For, JSXElement} from 'solid-js';

const data = Array.from({length: 10}, (_, index) => ({
  title: `Tab ${index}`,
}));

type Props = {
  title: string;
};

const Tab = (props: Props): JSXElement => {
  return (
    <a class='flex p-3 bg-slate-800 max-w-20 min-w-20 border-r-2'>
      <div>{props.title}</div>
    </a>
  );
};

export const Tabs = (): JSXElement => {
  return (
    <div class='flex'>
      <ul class='flex'>
        <For each={data}>
          {(item) => (
            <li>
              <Tab title={item.title} />
            </li>
          )}
        </For>
      </ul>
      <div>
        <PlusIcon />
      </div>
    </div>
  );
};
