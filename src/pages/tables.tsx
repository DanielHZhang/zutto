import {Link} from 'solid-app-router';
import {createResource, createSignal, ErrorBoundary, JSXElement, Show} from 'solid-js';
import {fetchAllTables} from 'src/actions';
import {Button, Grid, Input} from 'src/components/base';

export const Tables = (): JSXElement => {
  const [searchFilter, setSearchFilter] = createSignal('');
  // const [filteredTables, setFilteredTables] = createSignal([]);
  const [tables] = createResource(fetchAllTables);

  const filterTables = () => {
    return tables()?.filter((tableName) => tableName.includes(searchFilter()));
  };

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Tables</h1>
      <ErrorBoundary fallback={(error) => <div>Error fetching tables: {error.message}</div>}>
        <Show when={tables()} fallback={<div>Loading...</div>}>
          <Input
            placeholder='Search...'
            onInput={(event) => setSearchFilter(event.currentTarget.value)}
          />
          <Grid items={filterTables()}>
            {(item) => (
              <Link
                href={`/explorer/${item}`}
                class='flex justify-between items-center bg-slate-700 rounded-md p-4'
              >
                <span>{item}</span>
                <Button>Edit</Button>
              </Link>
            )}
          </Grid>
        </Show>
      </ErrorBoundary>
    </section>
  );
};

export default Tables;
