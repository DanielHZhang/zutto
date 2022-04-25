import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {useParams} from 'solid-app-router';
import type {JSX} from 'solid-js';
import {createEffect, createResource, createSignal, For, Show} from 'solid-js';
import {createStore} from 'solid-js/store';
import {queryTableData} from 'src/actions';
import {Button, SplitButton} from 'src/components/base';
import {Table} from 'src/components/explorer';
import type {ModificationsMap} from 'src/types';

export const TableDataWrapper = (): JSX.Element => {
  const params = useParams();
  const [modifications, setModifications] = createStore<ModificationsMap>({});
  const [tableName] = createSignal({tableName: params.tableName, offset: 0});
  const [tableData, {mutate, refetch}] = createResource(tableName, queryTableData);

  const getData = () => tableData()?.data || [];
  const getHeaders = () => tableData()?.headers || [];

  createEffect(() => {
    console.log('what:', tableData());
  });

  return (
    <div class='flex flex-col pt-2 space-y-2 min-h-0'>
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
          <Button variant='primary' size='sm' onClick={() => refetch()}>
            <RefreshIcon width='16px' height='16px' />
          </Button>
        </div>
      </section>
      <Table
        data={getData()}
        headers={getHeaders()}
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
    </div>
  );
};
