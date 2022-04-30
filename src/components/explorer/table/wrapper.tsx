import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {useParams} from 'solid-app-router';
import type {JSX} from 'solid-js';
import {createEffect, createResource, createSignal, Show, useContext} from 'solid-js';
import {produce} from 'solid-js/store';
import {queryTableData} from 'src/actions';
import {Button, SplitButton} from 'src/components/base';
import {Table} from 'src/components/explorer';
import {RootContext} from 'src/stores';

export const TableDataWrapper = (): JSX.Element => {
  const params = useParams();
  const tableName = () => decodeURIComponent(params.tableName);
  const [root, setRoot] = useContext(RootContext);
  const [offset, setOffset] = createSignal(0); // TODO: use offset to paginate
  const [tableData, {refetch}] = createResource(() => ({tableName: tableName(), offset: offset()}), queryTableData);

  createEffect(() => {
    const data = tableData();
    if (data) {
      setRoot(
        produce((state) => {
          state.tables[tableName()] = {...data, modifications: {}};
        })
      );
    }
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
          <Show when={root.tables[tableName()] && Object.keys(root.tables[tableName()].modifications).length > 0}>
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
      <Table tableName={tableName()} />
    </div>
  );
};
