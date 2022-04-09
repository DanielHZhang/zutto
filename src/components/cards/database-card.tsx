import RightArrowIcon from 'iconoir/icons/arrow-right.svg';
import DatabaseIcon from 'iconoir/icons/db.svg';
import {JSX, JSXElement} from 'solid-js';
import {Button, Subheading} from 'src/components/base';
import type {PublicConnectionConfig} from 'src/types';

type Props = {
  data: PublicConnectionConfig;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
};

export const DatabaseCard = (props: Props): JSXElement => {
  return (
    <div class='flex flex-col bg-slate-800 rounded-lg p-8 min-w-60 shadow-sm'>
      <DatabaseIcon width='64' height='64' />
      <Subheading class='font-medium'>{props.data.name}</Subheading>
      <div>
        {props.data.host}:{props.data.port}
      </div>
      <div>{props.data.username}</div>
      <div>{props.data.databaseName}</div>
      <div class='flex justify-between'>
        <Button>edit</Button>
        <Button variant='primary' onClick={props.onClick}>
          <RightArrowIcon />
        </Button>
      </div>
    </div>
  );
};
