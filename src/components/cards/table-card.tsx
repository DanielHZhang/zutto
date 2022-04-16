import EditIcon from 'iconoir/icons/edit-pencil.svg';
import TableRowsIcon from 'iconoir/icons/table-rows.svg';
import TableIcon from 'iconoir/icons/table.svg';
import TableColumnsIcon from 'iconoir/icons/view-columns-2.svg';
import {Link} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createSignal, Show} from 'solid-js';
import {Menu, MenuButton, MenuItem, MenuList} from 'src/components/base';
import PageEditIcon from 'src/components/icons/page-edit.svg';
import TrashIcon from 'src/components/icons/trash.svg';
import {toExplorer} from 'src/routes';
import type {TableOverview} from 'src/types';

type Props = {
  data: TableOverview;
  onAction: (key: string) => void;
};

export const TableCard = (props: Props): JSXElement => {
  const [isEditVisible, setEditVisible] = createSignal(false);
  const [isMenuVisible, setMenuVisible] = createSignal(false);

  const formatNumber = (num: number) => {
    if (num > 1e6) {
      return `${(num / 1e6).toFixed(1)}M`;
    }
    if (num > 1e4) {
      return `${(num / 1e3).toFixed(1)}K`;
    }
    return num;
  };

  return (
    <div
      class='flex justify-between items-center bg-card rounded-md p-5 min-h-20 shadow-md'
      onMouseOver={() => setEditVisible(true)}
      onMouseLeave={() => !isMenuVisible() && setEditVisible(false)}
    >
      <Link href={toExplorer(props.data.name)}>
        <div class='flex items-center'>
          <TableIcon />
          <div class='mx-4'>
            <div class='text-lg font-medium'>{props.data.name}</div>
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
        <MenuButton variant='ghost' style={{visibility: isEditVisible() ? 'visible' : 'hidden'}}>
          <EditIcon />
        </MenuButton>
        <MenuList>
          <MenuItem key='rename'>
            <PageEditIcon />
            <span class='ml-2'>Rename</span>
          </MenuItem>
          <MenuItem key='delete'>
            <TrashIcon />
            <span class='ml-2'>Delete</span>
          </MenuItem>
        </MenuList>
      </Menu>
      <div class='text-gray-300 flex flex-col py-1 px-2 bg-slate-700 rounded-md'>
        <div class='flex justify-end items-center '>
          <span class='mr-1'>{formatNumber(props.data.numRecords)}</span>
          <TableRowsIcon width='16px' height='16px' />
        </div>
        <div class='flex justify-end items-center'>
          <div class='mr-1'>{formatNumber(props.data.numColumns)}</div>
          <TableColumnsIcon width='16px' height='16px' />
        </div>
      </div>
    </div>
  );
};
