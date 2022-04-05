import {createResource, ErrorBoundary, JSXElement, Show} from 'solid-js';
import {Grid} from 'src/components/base';
import {fetchAllTables} from 'src/resources';

const tableData = Array.from({length: 100}, (_, index) => ({
  name: `Table name ${index}`,
}));

export const Tables = (): JSXElement => {
  const [table] = createResource(fetchAllTables);

  return (
    <div>
      Tables
      <ErrorBoundary fallback={(error) => <div>Error fetching tables: {error.message}</div>}>
        <Show when={table()} fallback={<div>Loading...</div>}>
          <Grid items={table()}>
            {(item) => (
              <div>
                <div class='bg-slate-700 rounded-md p-4'>{item}</div>
              </div>
            )}
          </Grid>
        </Show>
      </ErrorBoundary>
    </div>
  );
};

export default Tables;
