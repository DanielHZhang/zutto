import {useNavigate} from 'solid-app-router';
import {createResource, createSignal, For, JSXElement} from 'solid-js';
import {Button, Input, Modal} from 'src/components/base';
import {ActionCard, DatabaseCard} from 'src/components/home';
import {createForm} from 'src/hooks';
import {actions, fetchRecentDatabases, invokeTauri} from 'src/resources';

const data = [
  {
    name: 'Testing db',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    databaseName: 'database',
  },
  {
    name: 'Testing db',
    host: 'localhost',
    port: 5432,
    username: 'admin',
    databaseName: 'database',
  },
];

export default function Home(): JSXElement {
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [recentDatabases] = createResource(fetchRecentDatabases);
  const navigate = useNavigate();
  const form = createForm({
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
    console.log('receiving values:', values);
    await invokeTauri(actions.connectToDatabase, values);
    navigate('/tables');
  });

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Databases</h1>
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
        <h1>Recently Opened</h1>
        <div class='flex space-x-4'>
          <For each={data}>{(item) => <DatabaseCard {...item} />}</For>
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
