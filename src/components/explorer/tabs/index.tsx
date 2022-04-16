import PlusIcon from 'iconoir/icons/plus.svg';
import {useNavigate, useParams} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createResource, createSignal, For, useContext} from 'solid-js';
import {closeTab, fetchTabs} from 'src/actions';
import {Button, Heading, Modal} from 'src/components/base';
import {Tab} from 'src/components/explorer/tabs/item';
import {GlobalContext} from 'src/stores';

export const Tabs = (): JSXElement => {
  const params = useParams();
  const navigate = useNavigate();
  const [global] = useContext(GlobalContext);
  const [tabs, {refetch: refetchTabs}] = createResource(() => global.connection.id, fetchTabs);
  const [isModalOpen, setModalOpen] = createSignal(false);
  const isTabActive = (name: string) => name.split(' ').join('') === params.tableName;

  return (
    <div class='flex overflow-x-auto'>
      <ul class='flex overflow-x-auto overflow-y-hidden'>
        <For each={tabs()}>
          {(tableName, index) => (
            <li>
              <Tab
                title={tableName}
                isActive={isTabActive(tableName)}
                allowClose={tabs()!.length > 1}
                onClose={async () => {
                  await closeTab(global.connection.id, tableName);

                  if (isTabActive(tableName)) {
                    let newFocusIndex = index();
                    if (index() < tabs()!.length - 1) {
                      newFocusIndex = index() + 1;
                    }
                    navigate(`/explorer/${tabs()![newFocusIndex]}`);
                  }

                  refetchTabs();
                }}
              />
            </li>
          )}
        </For>
      </ul>
      <div class='flex items-center justify-center mx-2'>
        <Button variant='ghost' class='hover:bg-slate-100 hover:bg-opacity-10' onClick={() => setModalOpen(true)}>
          <PlusIcon />
        </Button>
      </div>
      <Modal isOpen={isModalOpen()} onClose={() => setModalOpen(false)}>
        <Heading>Open another table</Heading>
        <div class='flex flex-col space-y-2'>
          {/* <For each={}>

								</For> */}
          <Button>Test</Button>
        </div>
      </Modal>
    </div>
  );
};
