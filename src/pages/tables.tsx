import Fuse from 'fuse.js';
import NavArrowRightIcon from 'iconoir/icons/nav-arrow-right.svg';
import PlusIcon from 'iconoir/icons/plus.svg';
import type {JSXElement} from 'solid-js';
import {
  createRenderEffect,
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  Show,
  Switch,
} from 'solid-js';
import {createStore} from 'solid-js/store';
import {deleteTable, queryAllTables, renameTable} from 'src/actions';
import {
  Alert,
  Button,
  Checkbox,
  CheckboxState,
  Grid,
  Heading,
  Input,
  Logo,
  Modal,
} from 'src/components/base';
import {TableCard} from 'src/components/cards';
import {ErrorContainer} from 'src/components/error';

const NEW_TABLE_MODAL = 'New Table';
const RENAME_TABLE_MODAL = 'Rename Table';
const DELETE_TABLE_MODAL = 'Delete Table';

export const Tables = (): JSXElement => {
  const [tables, {refetch}] = createResource(queryAllTables);
  const [state, setState] = createStore({
    modalOpen: '',
    searchFilter: '',
    selectedTable: '',
    newTableName: '',
    cascade: false,
  });
  const [error, setError] = createSignal('');
  const [newTable, setNewTable] = createStore({
    name: '',
    fields: [],
  });

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
      setState({modalOpen: RENAME_TABLE_MODAL, selectedTable: name, newTableName: name});
    } else if (key === 'delete') {
      setState({modalOpen: DELETE_TABLE_MODAL, selectedTable: name});
    }
  };

  const onRename = async () => {
    try {
      setError('');
      await renameTable({originalName: state.selectedTable, newName: state.newTableName});
      setState({modalOpen: '', selectedTable: '', newTableName: ''});
      refetch();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error(error);
      }
    }
  };

  const onDelete = async () => {
    try {
      setError('');
      await deleteTable({tableName: state.selectedTable, cascade: state.cascade});
      setState({modalOpen: '', selectedTable: '', cascade: false});
      refetch();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error(error);
      }
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
      <div class='flex space-x-4'>
        <Logo />
        <Heading>Tables</Heading>
      </div>
      <ErrorBoundary fallback={ErrorContainer}>
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
          <Grid items={filterTables()} fallback={<div>No tables found...</div>}>
            {(item) => <TableCard data={item} onAction={onTableCardAction(item.name)} />}
          </Grid>
        </Show>
      </ErrorBoundary>
      <Modal isOpen={!!state.modalOpen} trapFocus={false} onClose={() => setState('modalOpen', '')}>
        <Switch>
          {/* <Match when={state.modalOpen === NEW_TABLE_MODAL}>
            <Heading class='mb-6'>New Table</Heading>
            <Show when={error()}>
              <Alert status='error' description={error()} />
            </Show>
            <div class='flex flex-col space-y-4'>
              <Input placeholder='New Table Name' />
              <div>
                <For each={newTable.fields}>
                  {(field) => (
                    <div>
                      <div>wow</div>
                    </div>
                  )}
                </For>
              </div>
              <div class='flex justify-end space-x-4'>
                <Button variant='ghost'>Cancel</Button>
                <Button variant='primary'>
                  <span class='ml-2'>Create</span>
                  <NavArrowRightIcon />
                </Button>
              </div>
            </div>
          </Match> */}
          <Match when={state.modalOpen === RENAME_TABLE_MODAL}>
            <Heading class='mb-6'>Rename Table</Heading>
            <div class='flex flex-col space-y-4'>
              <Show when={error()}>
                <Alert status='error' description={error()} />
              </Show>
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
                <Button
                  variant='primary'
                  disabled={state.selectedTable === state.newTableName}
                  onClick={onRename}
                >
                  <span class='ml-2'>Continue</span>
                  <NavArrowRightIcon />
                </Button>
              </div>
            </div>
          </Match>
          <Match when={state.modalOpen === DELETE_TABLE_MODAL}>
            <Heading class='mb-6'>Delete Table</Heading>
            <div class='flex flex-col space-y-4'>
              <Show when={error()}>
                <Alert status='error' description={error()} />
              </Show>
              <div>
                <span>Are you sure you want to delete this table?</span>
                <pre class='p-1 bg-slate-900 rounded-md inline'>{state.selectedTable}</pre>
              </div>
              <div class='italic'>Warning: this action cannot be undone!</div>
              <div class='flex items-center space-x-2'>
                <Checkbox
                  onCheck={(state) => setState('cascade', state === CheckboxState.Checked)}
                />
                <span>Cascade</span>
              </div>
              <div class='flex justify-end space-x-2'>
                <Button variant='ghost' onClick={() => setState('modalOpen', '')}>
                  Cancel
                </Button>
                <Button variant='primary' onClick={onDelete} class='bg-red-500 hover:bg-red-400'>
                  Delete
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
