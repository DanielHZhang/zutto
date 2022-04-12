import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {useNavigate, useParams} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {
  createEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  onMount,
  Show,
  useContext,
} from 'solid-js';
import {createStore} from 'solid-js/store';
import {closeTab, fetchTabs, openTab, queryTableData} from 'src/actions';
import {Button, Heading, Logo, Modal, SplitButton} from 'src/components/base';
import {ErrorContainer} from 'src/components/error';
import {Tab, Table} from 'src/components/explorer';
import {RootContext} from 'src/stores';
import type {ModificationsMap} from 'src/types';

export default function Explorer(): JSXElement {
  const [root, setRoot] = useContext(RootContext);
  const navigate = useNavigate();
  const params = useParams();
  const [modifications, setModifications] = createStore<ModificationsMap>({});
  const [tableName] = createSignal({tableName: params.tableName, offset: 0});
  const [tableData, {mutate, refetch}] = createResource(tableName, queryTableData);
  // const [tabs, {refetch: refetchTabs}] = createResource(() => root.id, fetchTabs);
  const [isModalOpen, setModalOpen] = createSignal(false);

  const isTabActive = (name: string) => name.split(' ').join('') === params.tableName;

  // onMount(async () => {
  //   await openTab(root.id, params.tableName);
  //   refetchTabs();
  // });

  createEffect(() => {
    console.log(tableData());
  });

  return (
    <div class='flex flex-col space-y-2'>
      <div class='flex bg-header h-14 border-gray border-b-1'>
        <Logo href='/tables' class='px-4 border-gray border-r-1' />
        {/* <Show when={tabs()}>
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
                        await closeTab(root.id, tableName);

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
              <Button
                variant='ghost'
                class='hover:bg-slate-100 hover:bg-opacity-10'
                onClick={() => setModalOpen(true)}
              >
                <PlusIcon />
              </Button>
            </div>
            <Modal isOpen={isModalOpen()} onClose={() => setModalOpen(false)}>
              <Heading>Open another table</Heading>
              <div class='flex flex-col space-y-2'>
								<For each={}>

								</For>
                <Button>Test</Button>
              </div>
            </Modal>
          </div>
        </Show> */}
      </div>
      <ErrorBoundary fallback={ErrorContainer}>
        <Show when={tableData()} fallback={<div>Loading...</div>}>
          <section class='flex justify-between mx-2'>
            <div class='flex space-x-2'>
              <Button variant='primary' size='sm'>
                <PlusIcon />
                <span>Add Record</span>
              </Button>
              {/* <SplitButton size='sm' left={<span>Fields</span>} right={<span>0</span>} />
              <SplitButton size='sm' left={<span>Filters</span>} right={<span>1</span>} />
              <SplitButton size='sm' left={<span>Showing</span>} right={<span>1</span>} /> */}
            </div>
            <div class='flex space-x-2'>
              <Show when={Object.keys(modifications).length > 0}>
                <Button variant='ghost' size='sm'>
                  Discard Changes
                </Button>
                <Button size='sm'>Save Changes</Button>
              </Show>
              <Button variant='primary' size='sm' onClick={() => refetch()}>
                <RefreshIcon width='16px' height='16px' />
              </Button>
            </div>
          </section>
          <main>
            <Table
              data={tableData()!.data}
              headers={tableData()!.headers}
              modifications={modifications}
              onCellEdit={(modification) => {
                const {row, col, value} = modification;
                mutate((prevState) => {
                  const index = `${row},${col}` as const;

                  if (modifications[index]) {
                    setModifications(index, 'newValue', value);
                  } else {
                    setModifications(index, {
                      originalValue: prevState!.data[row][col],
                      newValue: value,
                    });
                  }

                  const table = prevState!.data;
                  table[row][col] = value;
                  return prevState;
                });
              }}
              onColumnRename={() => {
                //
              }}
              onDelete={() => {
                //
              }}
            />
          </main>
        </Show>
      </ErrorBoundary>
    </div>
  );
}
