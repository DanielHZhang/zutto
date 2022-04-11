import type {JSXElement} from 'solid-js';
import {Match, Switch} from 'solid-js';
import DeleteCircleIcon from 'src/components/icons/delete-circled-outline.svg';

type Props = {
  status: 'error';
  description: string;
};

export const Alert = (props: Props): JSXElement => {
  /** @tw */
  const errorClass = 'bg-red-700';
  return (
    <div class='flex p-2 space-x-2 rounded-md' classList={{[errorClass]: props.status === 'error'}}>
      <Switch>
        <Match when={props.status === 'error'}>
          <div class='flex items-center'>
            <DeleteCircleIcon class='text-red-300' />
          </div>
        </Match>
      </Switch>
      <div class='font-medium'>{props.description}</div>
    </div>
  );
};
