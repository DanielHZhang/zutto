import Fuse from 'fuse.js';
import NavArrowRightIcon from 'iconoir/icons/nav-arrow-right.svg';
import PlusIcon from 'iconoir/icons/plus.svg';
import type {JSXElement} from 'solid-js';
import {createRenderEffect, createResource, ErrorBoundary, Match, Show, Switch} from 'solid-js';
import {createStore} from 'solid-js/store';
import {queryAllTables} from 'src/actions';
import {Button, Grid, Heading, Input, Modal} from 'src/components/base';
import {TableCard} from 'src/components/cards';

const NEW_TABLE_MODAL = 'New Table';
const RENAME_TABLE_MODAL = 'Rename Table';

export const Tables = (): JSXElement => {
  const [state, setState] = createStore({
    modalOpen: '',
    searchFilter: '',
    selectedTable: '',
    newTableName: '',
  });
  const [tables] = createResource(queryAllTables);

  const filterTables = () => {
    const tableNames = tables();
    if (!tableNames) {
      return [];
    }
    if (!state.searchFilter) {
      return tableNames;
    }
    const fuse = new Fuse(tableNames, {includeScore: false, keys: ['name']});
    const searchResults = fuse.search(state.searchFilter);
    return searchResults.map((result) => result.item);
  };

  const onTableCardAction = (name: string) => (key: string) => {
    if (key === 'rename') {
      setState({modalOpen: RENAME_TABLE_MODAL, selectedTable: name});
    }
  };

  let renameInput: HTMLInputElement;
  createRenderEffect(() => {
    if (state.modalOpen === RENAME_TABLE_MODAL && renameInput) {
      renameInput.focus();
    }
  });

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Tables</h1>
      <ErrorBoundary fallback={(error) => <div>Error fetching tables: {error.message}</div>}>
        <Show when={tables()} fallback={<div>Loading...</div>}>
          <div class='flex space-x-4'>
            <Button variant='primary' onClick={() => setState('modalOpen', NEW_TABLE_MODAL)}>
              <PlusIcon />
              <span class='mx-1'>New Table</span>
            </Button>
            <Input
              class='flex-grow'
              placeholder='Search for table...'
              onInput={(event) => setState('searchFilter', event.currentTarget.value)}
            />
          </div>
          <Grid items={filterTables()}>
            {(item) => <TableCard title={item.name} onAction={onTableCardAction(item.name)} />}
          </Grid>
        </Show>
      </ErrorBoundary>
      <Modal isOpen={!!state.modalOpen} trapFocus={false} onClose={() => setState('modalOpen', '')}>
        <Switch>
          <Match when={state.modalOpen === NEW_TABLE_MODAL}>
            <Heading class='mb-6'>New Table</Heading>
            <div class='flex flex-col space-y-4'>
              <Input placeholder='New Table Name' />
              <div class='flex justify-end space-x-4'>
                <Button variant='ghost'>Cancel</Button>
                <Button variant='primary'>
                  <span class='ml-2'>Continue</span>
                  <NavArrowRightIcon />
                </Button>
              </div>
            </div>
          </Match>
          <Match when={state.modalOpen === RENAME_TABLE_MODAL}>
            <Heading class='mb-6'>Rename Table</Heading>
            <div class='flex flex-col space-y-4'>
              <Input
                ref={(element) => (renameInput = element)}
                value={state.selectedTable}
                placeholder='Table Name'
                onInput={(event) => setState('newTableName', event.currentTarget.value)}
              />
              <div class='flex justify-end space-x-4'>
                <Button variant='ghost' onClick={() => setState('modalOpen', '')}>
                  Cancel
                </Button>
                <Button variant='primary'>
                  <span class='ml-2'>Continue</span>
                  <NavArrowRightIcon />
                </Button>
              </div>
            </div>
          </Match>
        </Switch>
      </Modal>
    </section>
  );
};

export default Tables;
