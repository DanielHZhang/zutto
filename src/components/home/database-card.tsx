import {JSXElement} from 'solid-js';

type Props = {
  name: string;
  host: string;
  port: number;
  username: string;
};

export const DatabaseCard = (props: Props): JSXElement => {
  return (
    <div class='flex flex-col bg-slate-600 rounded-lg p-8'>
      <h1 class='text-lg font-medium'>{props.name}</h1>
      <div>{props.host}</div>
      <div>{props.port}</div>
      <div>{props.username}</div>
      <div class='flex'>
        <button>edit</button>
        <button>{'->'}</button>
      </div>
    </div>
  );
};
