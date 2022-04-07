import {useParams} from 'solid-app-router';
import {createResource, createSignal, JSXElement} from 'solid-js';
import {fetchTableData} from 'src/actions';
import {Button} from 'src/components/base';
import {Table, Tabs} from 'src/components/explorer';

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
  const [tableName, setTableName] = createSignal(params.tableName);
  const [tableData] = createResource(tableName, fetchTableData);

  console.log('table data:', tableData());
  return (
    <div class='flex flex-col'>
      <div class='flex'>
        <div>Home</div>
        <Tabs />
      </div>
      <section class='flex'>
        <Button>Refresh</Button>
        <div>Filters button</div>
        <div>Show number of records button</div>
        <Button>Add Record</Button>
        <Button>Save Changes</Button>
      </section>
      <main>
        <Table data={data} headers={headers} />
      </main>
    </div>
  );
}
