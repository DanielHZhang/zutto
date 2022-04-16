import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {useNavigate, useParams} from 'solid-app-router';
import type {JSX, JSXElement} from 'solid-js';
import {createEffect, createResource, createSignal, ErrorBoundary, Show, Suspense} from 'solid-js';
import {createStore} from 'solid-js/store';
import {closeTab, fetchTabs, openTab, queryTableData} from 'src/actions';
import {Button, Heading, Logo, Modal, SplitButton} from 'src/components/base';
import {ErrorContainer} from 'src/components/error';
import {Tab, Table, Tabs} from 'src/components/explorer';
import {GlobalContext} from 'src/stores';
import type {ModificationsMap} from 'src/types';

export const TableDataWrapper = (): JSX.Element => {
  const params = useParams();
  const [modifications, setModifications] = createStore<ModificationsMap>({});
  const [tableName] = createSignal({tableName: params.tableName, offset: 0});
  const [tableData, {mutate, refetch}] = createResource(tableName, queryTableData);

  return (
    <main>
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
      <section>
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
      </section>
    </main>
  );
};
