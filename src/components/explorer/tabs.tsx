import PlusIcon from 'iconoir/icons/plus.svg';
import type {JSXElement} from 'solid-js';
import {For} from 'solid-js';
import {Button} from 'src/components/base';

const data = Array.from({length: 10}, (_, index) => ({
  title: `Tab ${index}`,
}));

type Props = {
  title: string;
};

const Tab = (props: Props): JSXElement => {
  return (
    <a class='flex items-center p-3 bg-slate-800 max-w-20 min-w-20 border-r-2 h-full'>
      <div>{props.title}</div>
    </a>
  );
};

export const Tabs = (): JSXElement => {
  return (
    <div class='flex overflow-x-auto'>
      <ul class='flex overflow-x-auto overflow-y-hidden'>
        <For each={data}>
          {(item) => (
            <li>
              <Tab title={item.title} />
            </li>
          )}
        </For>
      </ul>
      <div class='flex items-center justify-center mx-2'>
        <Button>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};
