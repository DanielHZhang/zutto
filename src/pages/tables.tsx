import Fuse from 'fuse.js';
import {createResource, createSignal, ErrorBoundary, JSXElement, Show} from 'solid-js';
import {queryAllTables} from 'src/actions';
import {Button, Grid, Input} from 'src/components/base';
import {TableCard} from 'src/components/cards';

export const Tables = (): JSXElement => {
  const [searchFilter, setSearchFilter] = createSignal('');
  const [tables] = createResource(queryAllTables);

  const filterTables = () => {
    const tableNames = tables();
    if (!tableNames) {
      return [];
    }
    if (!searchFilter()) {
      return tableNames;
    }
    const fuse = new Fuse(tableNames);
    const searchResults = fuse.search(searchFilter());
    return searchResults.map((result) => result.item);
  };

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Tables</h1>
      <ErrorBoundary fallback={(error) => <div>Error fetching tables: {error.message}</div>}>
        <Show when={tables()} fallback={<div>Loading...</div>}>
          <div class='flex space-x-4'>
            <Button variant='primary'>New Table</Button>{' '}
            <Input
              class='flex-grow'
              placeholder='Search for table...'
              onInput={(event) => setSearchFilter(event.currentTarget.value)}
            />
          </div>
          <Grid items={filterTables()}>{(item) => <TableCard title={item} />}</Grid>
        </Show>
      </ErrorBoundary>
    </section>
  );
};

export default Tables;
