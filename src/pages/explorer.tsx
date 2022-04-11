import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {useParams} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createResource, createSignal, ErrorBoundary, For, Show} from 'solid-js';
import {createStore} from 'solid-js/store';
import {queryTableData} from 'src/actions';
import {Button, Logo, SplitButton} from 'src/components/base';
import {ErrorContainer} from 'src/components/error';
import {Tab, Table} from 'src/components/explorer';
import type {ModificationsMap} from 'src/types';

const data = Array.from({length: 4}, (_, index) => ({
  title: `Tab ${index} really really long title`,
}));

export default function Explorer(): JSXElement {
  const params = useParams();
  const [modifications, setModifications] = createStore<ModificationsMap>({});
  const [tableName] = createSignal(params.tableName);
  const [tableData, {mutate, refetch}] = createResource(tableName, queryTableData);

  return (
    <div class='flex flex-col space-y-2'>
      <div class='flex bg-header h-14 border-gray border-b-1'>
        <Logo class='px-4 border-gray border-r-1' />
        <div class='flex overflow-x-auto'>
          <ul class='flex overflow-x-auto overflow-y-hidden'>
            <For each={data}>
              {(item) => (
                <li>
                  <Tab title={item.title} isActive={true} />
                </li>
              )}
            </For>
          </ul>
          <div class='flex items-center justify-center mx-2'>
            <Button>
              <PlusIcon />
            </Button>
          </div>
        </div>
      </div>
      <ErrorBoundary fallback={ErrorContainer}>
        <Show when={tableData()} fallback={<div>Loading...</div>}>
          <section class='flex justify-between mx-2'>
            <div class='flex space-x-2'>
              <Button variant='primary' size='sm'>
                <PlusIcon />
                <span>Add Record</span>
              </Button>
              <SplitButton size='sm' left={<span>Fields</span>} right={<span>0</span>} />
              <SplitButton size='sm' left={<span>Filters</span>} right={<span>1</span>} />
              <SplitButton size='sm' left={<span>Showing</span>} right={<span>1</span>} />
            </div>
            <div class='flex space-x-2'>
              <Show when={Object.keys(modifications).length > 0}>
                <Button variant='ghost' size='sm'>
                  Discard Changes
                </Button>
                <Button size='sm'>Save Changes</Button>
              </Show>
              <Button size='sm' onClick={() => refetch()}>
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
                      originalValue: prevState!.data[row][col].content,
                      newValue: value,
                    });
                  }

                  const table = prevState!.data;
                  table[row][col].content = value;
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
