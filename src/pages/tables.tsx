import Fuse from 'fuse.js';
import PlusIcon from 'iconoir/icons/plus.svg';
import type {JSXElement} from 'solid-js';
import {createResource, createSignal, ErrorBoundary, Match, Show, Switch} from 'solid-js';
import {queryAllTables} from 'src/actions';
import {Button, Grid, Heading, Input, Modal} from 'src/components/base';
import {TableCard} from 'src/components/cards';

const NEW_TABLE_MODAL = 'New Table';
const RENAME_TABLE_MODAL = 'Rename Table';

export const Tables = (): JSXElement => {
  const [modalOpen, setModalOpen] = createSignal<string | null>(null);
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
    const fuse = new Fuse(tableNames, {includeScore: false, keys: ['name']});
    const searchResults = fuse.search(searchFilter());
    return searchResults.map((result) => result.item);
  };

  const onTableCardAction = (name: string) => (key: string) => {
    if (key === 'rename') {
      setModalOpen(RENAME_TABLE_MODAL);
    }
    console.log('got table card action:', key);
  };

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Tables</h1>
      <ErrorBoundary fallback={(error) => <div>Error fetching tables: {error.message}</div>}>
        <Show when={tables()} fallback={<div>Loading...</div>}>
          <div class='flex space-x-4'>
            <Button variant='primary' onClick={() => setModalOpen(NEW_TABLE_MODAL)}>
              <PlusIcon />
              <span class='mx-1'>New Table</span>
            </Button>
            <Input
              class='flex-grow'
              placeholder='Search for table...'
              onInput={(event) => setSearchFilter(event.currentTarget.value)}
            />
          </div>
          <Grid items={filterTables()}>
            {(item) => <TableCard title={item.name} onAction={onTableCardAction(item.name)} />}
          </Grid>
        </Show>
      </ErrorBoundary>
      <Modal isOpen={modalOpen() !== null} onClose={() => setModalOpen(null)}>
        <Switch>
          <Match when={modalOpen() === NEW_TABLE_MODAL}>
            <div>New Table</div>
          </Match>
          <Match when={modalOpen() === RENAME_TABLE_MODAL}>
            <Heading>Rename Table</Heading>
            <div class='flex'>
              <Input placeholder='New Table Name' />
            </div>
          </Match>
        </Switch>
      </Modal>
    </section>
  );
};

export default Tables;
