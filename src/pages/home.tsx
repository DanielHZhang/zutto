import {useNavigate} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  onMount,
  Show,
  Switch,
  useContext,
} from 'solid-js';
import {
  beginConnection,
  closeConnection,
  deleteConnection,
  editConnection,
  queryRecentDatabases,
} from 'src/actions';
import {Button, Heading, Input, Logo, Modal, Subheading} from 'src/components/base';
import {ActionCard, DatabaseCard} from 'src/components/cards';
import {ErrorContainer} from 'src/components/error';
import {createForm} from 'src/hooks';
import {RootContext} from 'src/stores';
import type {ConnectionConfig} from 'src/types';

export default function Home(): JSXElement {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = createSignal({
    name: '',
    id: '',
  });
  const [recentDatabases, {refetch}] = createResource(queryRecentDatabases);
  const form = createForm<ConnectionConfig>({
    initialValues: {
      name: '',
      host: 'localhost',
      port: 5432,
      username: '',
      password: '',
      databaseName: '',
    },
  });
  const [root, setRoot] = useContext(RootContext);

  const resetModal = () => setModalOpen({name: '', id: ''});

  const onSubmit = form.handleSubmit(async (values) => {
    if (modalOpen().id) {
      await editConnection(values);
      resetModal();
    } else {
      const id = await beginConnection({config: values});
      setRoot('id', id);
      navigate('/tables');
    }
  });

  const onDelete = async () => {
    try {
      await deleteConnection(modalOpen().id);
      resetModal();
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  onMount(async () => {
    await closeConnection(); // Close the previous connection when navigating home
    setRoot('id', '');
  });

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <div class='flex space-x-4'>
        <Logo />
        <Heading>Databases</Heading>
      </div>
      <div>
        <ActionCard
          title='Open Database'
          description='View and visualize'
          onClick={() => setModalOpen((prev) => ({...prev, name: 'connect'}))}
        />
      </div>
      <ErrorBoundary fallback={ErrorContainer}>
        <div>
          <Subheading>Recently Opened</Subheading>
          <div class='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
            <Show when={recentDatabases()} fallback={<div>Loading...</div>}>
              <For each={recentDatabases()}>
                {(config) => (
                  <DatabaseCard
                    data={config}
                    onConnectClick={async () => {
                      try {
                        await beginConnection({id: config.id});
                        setRoot('id', config.id);
                        navigate('/tables');
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                    onMenuAction={(key) => {
                      const {id, ...rest} = config;
                      setModalOpen({name: key, id});
                      if (key === 'connect') {
                        form.setValues(rest);
                      }
                    }}
                  />
                )}
              </For>
            </Show>
          </div>
        </div>
      </ErrorBoundary>
      <Modal isOpen={!!modalOpen().name} onClose={resetModal}>
        <Switch>
          <Match when={modalOpen().name === 'connect'}>
            <Heading class='mb-6'>{modalOpen().id ? 'Edit Connection' : 'New Connection'}</Heading>
            <form onSubmit={onSubmit}>
              <div class='flex flex-col space-y-3'>
                <Input placeholder='Nickname' {...form.register('name')} />
                <Input placeholder='Host' {...form.register('host')} />
                <Input placeholder='Port' {...form.register('port')} />
                <Input placeholder='Database name' {...form.register('databaseName')} />
                <Input placeholder='Username' {...form.register('username')} />
                <Input placeholder='Password' type='password' {...form.register('password')} />
                <Button variant='primary' type='submit'>
                  <span>{modalOpen().id ? 'Save' : 'Connect'}</span>
                </Button>
              </div>
            </form>
          </Match>
          <Match when={modalOpen().name === 'delete'}>
            <Heading class='mb-6'>Delete Connection</Heading>
            <div class='flex flex-col space-y-4'>
              <div>Are you sure you want to delete this connection?</div>
              <div class='flex justify-end space-x-2'>
                <Button variant='ghost' onClick={resetModal}>
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
}
