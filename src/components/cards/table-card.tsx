import EditIcon from 'iconoir/icons/edit-pencil.svg';
import TableRowsIcon from 'iconoir/icons/table-rows.svg';
import TableIcon from 'iconoir/icons/table.svg';
import TableColumnsIcon from 'iconoir/icons/view-columns-2.svg';
import {Link} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createSignal, Show} from 'solid-js';
import {Menu, MenuButton, MenuItem, MenuList} from 'src/components/base';
import type {TableOverview} from 'src/types';

type Props = {
  data: TableOverview;
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
      <Link href={`/explorer/${props.data.name}`}>
        <div class='flex items-center'>
          <TableIcon />
          <div class='ml-4 flex flex-col space-y-1'>
            <div class='text-lg font-medium'>{props.data.name}</div>
            <div class='text-gray-300 flex space-x-2'>
              <div class='flex items-center bg-cyan-700 border-b-2 border-b-cyan-400 rounded-md px-1'>
                <TableRowsIcon width='16px' height='16px' />
                <span class='ml-1'>{props.data.numRecords}</span>
              </div>
              <div class='flex items-center bg-cyan-700 border-b-2 border-b-cyan-400 rounded-md px-1'>
                <TableColumnsIcon width='16px' height='16px' />
                <span class='ml-1'>{props.data.numColumns}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <Menu
        onClose={() => setEditVisible(false)}
        onVisiblityChange={(visible) => setMenuVisible(visible)}
        onSelect={(key) => {
          props.onAction(key);
          setEditVisible(false);
          setMenuVisible(false);
        }}
      >
        <Show when={isEditVisible()}>
          <MenuButton>
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
