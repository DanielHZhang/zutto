import EditIcon from 'iconoir/icons/edit-pencil.svg';
import TableIcon from 'iconoir/icons/table-2-columns.svg';
import {Link} from 'solid-app-router';
import {createSignal, JSXElement, Show} from 'solid-js';
import {Button, Menu, MenuButton, MenuItem, MenuList} from 'src/components/base';

type Props = {
  title: string;
  onAction: (key: string) => void;
};

export const TableCard = (props: Props): JSXElement => {
  const [isEditVisible, setEditVisible] = createSignal(false);
  const [isMenuVisible, setMenuVisible] = createSignal(false);

  return (
    <div
      class='flex justify-between items-center bg-slate-700 rounded-md px-6 py-4 min-h-20 shadow-md'
      onMouseOver={() => setEditVisible(true)}
      onMouseLeave={() => !isMenuVisible() && setEditVisible(false)}
    >
      <Link href={`/explorer/${props.title}`}>
        <div class='flex items-center'>
          <TableIcon />
          <span class='ml-2 font-medium'>{props.title}</span>
        </div>
      </Link>
      <Menu
        onSelect={(key) => {
          props.onAction(key);
          setEditVisible(false);
          setMenuVisible(false);
        }}
      >
        <Show when={isEditVisible()}>
          <MenuButton onClick={() => setMenuVisible(!isMenuVisible())}>
            <EditIcon />
          </MenuButton>
        </Show>
        <MenuList>
          <MenuItem key='rename'>Rename</MenuItem>
          <MenuItem key='drop'>Drop</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};
