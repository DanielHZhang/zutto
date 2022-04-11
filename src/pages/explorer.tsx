import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {Link, useParams} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createResource, createSignal, For, Show, Suspense} from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import {queryAllTables, queryTableData} from 'src/actions';
import {Button, SplitButton} from 'src/components/base';
import {Table, Tabs} from 'src/components/explorer';
import CubeIcon from 'src/components/icons/3d-select-face.svg';
import type {ModificationPayload} from 'src/types';

export default function Explorer(): JSXElement {
  const params = useParams();
  const [modifications, setModifications] = createStore<ModificationPayload>({});
  const [tableName] = createSignal(params.tableName);
  const [tableData, {mutate, refetch}] = createResource(tableName, queryTableData);

  return (
    <div class='flex flex-col space-y-2'>
      <div class='flex bg-header'>
        <Link href='/' class='flex items-center'>
          <div class='flex items-center px-4'>
            <CubeIcon />
          </div>
        </Link>
        <Tabs />
      </div>
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
            <Button size='sm'>
              <RefreshIcon width='16px' height='16px' />
            </Button>
          </div>
        </section>
        <main>
          <Table
            data={tableData()!.data}
            headers={tableData()!.headers}
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
    </div>
  );
}
