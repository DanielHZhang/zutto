import EditIcon from 'iconoir/icons/edit-pencil.svg';
import TableIcon from 'iconoir/icons/table-2-columns.svg';
import {Link} from 'solid-app-router';
import {createSignal, JSXElement, Show} from 'solid-js';
import {Button, Menu, MenuButton, MenuList} from 'src/components/base';

type Props = {
  title: string;
};

export const TableCard = (props: Props): JSXElement => {
  const [isEditVisible, setIsEditVisible] = createSignal(false);
  const [isMenuVisible, setIsMenuVisible] = createSignal(false);

  return (
    <div
      class='flex justify-between items-center bg-slate-700 rounded-md px-6 py-4 min-h-20 shadow-md'
      onMouseOver={() => setIsEditVisible(true)}
      onMouseLeave={() => setIsEditVisible(false)}
    >
      <Link href={`/explorer/${props.title}`}>
        <div class='flex items-center'>
          <TableIcon />
          <span class='ml-2 font-medium'>{props.title}</span>
        </div>
      </Link>
      <Show when={isEditVisible()}>
        <Menu>
          <MenuButton>
            <EditIcon />
          </MenuButton>
          <MenuList>
            <div>what is this list</div>
            <div>cool list</div>
          </MenuList>
        </Menu>
      </Show>
    </div>
  );
};
