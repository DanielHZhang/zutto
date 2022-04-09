import {useNavigate} from 'solid-app-router';
import {createResource, createSignal, For, JSXElement, Show} from 'solid-js';
import {connectToDatabase, fetchRecentDatabases} from 'src/actions';
import {Button, Heading, Input, Modal, Subheading} from 'src/components/base';
import {ActionCard, DatabaseCard} from 'src/components/cards';
import {createForm} from 'src/hooks';
import type {ConnectionConfig} from 'src/types';

export default function Home(): JSXElement {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [recentDatabases] = createResource(fetchRecentDatabases);
  const navigate = useNavigate();
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

  const connectAndNavigate = async (config: ConnectionConfig) => {
    await connectToDatabase({config});
    navigate('/tables');
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await connectAndNavigate(values);
  });

  const onCardClick = (index: number) => async () => {
    try {
      const connectionConfig = recentDatabases()![index];
      await connectAndNavigate(connectionConfig);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <Heading>Databases</Heading>
      <div>
        <ActionCard
          title='Open Database'
          description='View and visualize'
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </div>
      <div>
        <Subheading>Recently Opened</Subheading>
        <div class='grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-4 mt-4'>
          <Show when={recentDatabases()} fallback={<div>Loading...</div>}>
            <For each={recentDatabases()}>
              {(item, index) => <DatabaseCard data={item} onClick={onCardClick(index())} />}
            </For>
          </Show>
        </div>
      </div>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <h1 class='font-semibold text-lg'>New Connection</h1>
        <form onSubmit={onSubmit}>
          <div class='flex flex-col space-y-2'>
            <Input placeholder='Nickname' {...form.register('name')} />
            <Input placeholder='Host' {...form.register('host')} />
            <Input placeholder='Port' {...form.register('port')} />
            <Input placeholder='Database name' {...form.register('databaseName')} />
            <Input placeholder='Username' {...form.register('username')} />
            <Input placeholder='Password' type='password' {...form.register('password')} />
            <Button type='submit' onClick={() => console.log('clicking')}>
              Connect
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
