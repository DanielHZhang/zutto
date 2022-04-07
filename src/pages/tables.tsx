import {Link} from 'solid-app-router';
import {createResource, ErrorBoundary, JSXElement, Show} from 'solid-js';
import {fetchAllTables} from 'src/actions';
import {Button, Grid, Input} from 'src/components/base';

export const Tables = (): JSXElement => {
  const [table] = createResource(fetchAllTables);

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Tables</h1>
      <ErrorBoundary fallback={(error) => <div>Error fetching tables: {error.message}</div>}>
        <Show when={table()} fallback={<div>Loading...</div>}>
          <Input placeholder='Search...' />
          <Grid items={table()}>
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
