import DatabaseIcon from 'iconoir/icons/db.svg';
import {createSignal, JSXElement} from 'solid-js';
import {Button} from 'src/components/base';

type Props = {
  name: string;
  host: string;
  port: number;
  username: string;
};

export const DatabaseCard = (props: Props): JSXElement => {
  return (
    <div class='flex flex-col bg-slate-600 rounded-lg p-8 min-w-60'>
      <DatabaseIcon width='64' height='64' />
      <h1 class='text-lg font-medium'>{props.name}</h1>
      <div>{props.host}</div>
      <div>{props.port}</div>
      <div>{props.username}</div>
      <div class='flex justify-between'>
        <Button>edit</Button>
        <Button>{'->'}</Button>
      </div>
    </div>
  );
};
