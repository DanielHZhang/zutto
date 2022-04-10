import PlusIcon from 'iconoir/icons/plus.svg';
import RefreshIcon from 'iconoir/icons/refresh.svg';
import {useParams} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createResource, createSignal, For, Show} from 'solid-js';
import {queryAllTables, queryTableData} from 'src/actions';
import {Button} from 'src/components/base';
import {Table, Tabs} from 'src/components/explorer';
import CubeIcon from 'src/components/icons/3d-select-face.svg';

const headers = ['Name', 'Date', 'Description'];

const data = [
  [
    {id: 123, content: 'some string'},
    {id: 123, content: 'some string really really long content'},
    {id: 123, content: 'some string'},
  ],
  [
    {id: 234, content: 'more string'},
    {id: 234, content: 'more string'},
    {id: 234, content: 'more string'},
  ],
];

export default function Explorer(): JSXElement {
  const params = useParams();
  console.log('got params:', {...params});

  const [modifications, setModifications] = createSignal([]);
  const [tableName, setTableName] = createSignal(params.tableName);
  const [tableData] = createResource(tableName, queryTableData);
  const [tables] = createResource(queryAllTables);

  console.log('table data:', tableData());
  return (
    <div class='flex flex-col space-y-2'>
      <div class='flex'>
        <div class='flex items-center px-4'>
          <CubeIcon />
        </div>
        <Tabs />
      </div>
      <section class='flex justify-between mx-2'>
        <div class='flex space-x-2'>
          <Button variant='primary'>
            <PlusIcon />
            <span>Add Record</span>
          </Button>
          <Button>
            <span>Fields</span>
          </Button>
          <Button>
            <span>Filters</span>
            <span>1</span>
          </Button>
          <Button>
            <span>Showing</span>
          </Button>
        </div>
        <div class='flex space-x-2'>
          <Show when={modifications().length > 0}>
            <Button>Save Changes</Button>
          </Show>
          <Button>
            <RefreshIcon /* width='16px' height='16px' */ />
          </Button>
        </div>
      </section>
      <main>
        <Table data={data} headers={headers} />
      </main>
    </div>
  );
}
