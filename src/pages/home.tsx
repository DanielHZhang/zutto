import {useNavigate} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createResource, createSignal, For, Show} from 'solid-js';
import {connectToDatabase, queryRecentDatabases} from 'src/actions';
import {Button, Heading, Input, Modal, Subheading} from 'src/components/base';
import {ActionCard, DatabaseCard} from 'src/components/cards';
import {createForm} from 'src/hooks';
import type {ConnectionConfig} from 'src/types';

export default function Home(): JSXElement {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [recentDatabases] = createResource(queryRecentDatabases);
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

  const onSubmit = form.handleSubmit(async (values) => {
    await connectToDatabase({config: values});
    navigate('/tables');
  });

  const onCardClick = (index: number) => async () => {
    try {
      const config = recentDatabases()![index];
      await connectToDatabase({id: config.id});
      navigate('/tables');
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
        <div class='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
          <Show when={recentDatabases()} fallback={<div>Loading...</div>}>
            <For each={recentDatabases()}>
              {(item, index) => <DatabaseCard data={item} onConnectClick={onCardClick(index())} />}
            </For>
          </Show>
        </div>
      </div>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <Heading class='mb-6'>New Connection</Heading>
        <form onSubmit={onSubmit}>
          <div class='flex flex-col space-y-3'>
            <Input placeholder='Nickname' {...form.register('name')} />
            <Input placeholder='Host' {...form.register('host')} />
            <Input placeholder='Port' {...form.register('port')} />
            <Input placeholder='Database name' {...form.register('databaseName')} />
            <Input placeholder='Username' {...form.register('username')} />
            <Input placeholder='Password' type='password' {...form.register('password')} />
            <Button variant='primary' type='submit' onClick={() => console.log('clicking')}>
              Connect
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
