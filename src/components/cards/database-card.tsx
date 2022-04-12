import RightArrowIcon from 'iconoir/icons/arrow-right.svg';
import DatabaseIcon from 'iconoir/icons/db.svg';
import type {JSX, JSXElement} from 'solid-js';
import {createEffect, createSignal, Show} from 'solid-js';
import {Button, Menu, MenuButton, MenuItem, MenuList, Subheading} from 'src/components/base';
import DatabaseRoundedIcon from 'src/components/icons/database-rounded.svg';
import EditIcon from 'src/components/icons/edit.svg';
import MoreHorizontalIcon from 'src/components/icons/more-horiz.svg';
import ServerConnectionIcon from 'src/components/icons/server-connection.svg';
import TrashIcon from 'src/components/icons/trash.svg';
import UserIcon from 'src/components/icons/user.svg';
import type {PublicConnectionConfig} from 'src/types';

type Props = {
  data: PublicConnectionConfig;
  onConnectClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  onMenuAction: (key: string) => void;
};

export const DatabaseCard = (props: Props): JSXElement => {
  const [isEditVisible, setEditVisible] = createSignal(false);
  const [isMenuVisible, setMenuVisible] = createSignal(false);

  return (
    <div
      class='relative'
      onMouseOver={() => setEditVisible(true)}
      onMouseLeave={() => !isMenuVisible() && setEditVisible(false)}
    >
      <Menu
        onClose={() => setEditVisible(false)}
        onVisiblityChange={(visible) => setMenuVisible(visible)}
        onSelect={(key) => {
          props.onMenuAction(key);
          setEditVisible(false);
          setMenuVisible(false);
        }}
      >
        <Show when={isEditVisible()}>
          <MenuButton variant='ghost' class='absolute right-2 top-2'>
            <MoreHorizontalIcon />
          </MenuButton>
        </Show>
        <MenuList>
          <MenuItem key='connect'>
            <EditIcon />
            <span class='ml-2'>Edit</span>
          </MenuItem>
          <MenuItem key='delete'>
            <TrashIcon />
            <span class='ml-2'>Delete</span>
          </MenuItem>
        </MenuList>
      </Menu>
      <div class='flex flex-col bg-card rounded-lg p-8 min-w-60 shadow-md space-y-4'>
        <DatabaseIcon width='64' height='64' />
        <Subheading class='font-medium'>{props.data.name}</Subheading>
        <div class='flex flex-col space-y-1'>
          <div class='flex space-x-2'>
            <ServerConnectionIcon />
            <span>
              {props.data.host}:{props.data.port}
            </span>
          </div>
          <div class='flex space-x-2'>
            <UserIcon />
            <span>{props.data.username}</span>
          </div>
          <div class='flex space-x-2'>
            <DatabaseRoundedIcon />
            <span>{props.data.databaseName}</span>
          </div>
        </div>
        <div class='flex justify-between'>
          <Button variant='primary' onClick={props.onConnectClick}>
            <span>Connect</span>
            <RightArrowIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
