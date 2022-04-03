import {invoke} from '@tauri-apps/api';
import {createSignal, For, JSXElement} from 'solid-js';
import {Button, Input, Modal} from 'src/components/base';
import {ActionCard, DatabaseCard} from 'src/components/home';
import {IS_TAURI_ENV} from 'src/config';
import {createForm} from 'src/hooks';

const data = [
  {
    name: 'Testing db',
    host: 'localhost',
    port: 5432,
    username: 'admin',
  },
  {
    name: 'Testing db',
    host: 'localhost',
    port: 5432,
    username: 'admin',
  },
];

export const Home = (): JSXElement => {
  const form = createForm({
    initialValues: {
      nickname: '',
      host: 'localhost',
      port: 5432,
      username: '',
      password: '',
    },
  });
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const onSubmit = form.handleSubmit(async (values) => {
    if (IS_TAURI_ENV) {
      await invoke('database:connect', values);
    }
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
      <div class='flex space-x-4'>
        <For each={data}>{(item) => <DatabaseCard {...item} />}</For>
      </div>
      <Modal isOpen={isModalOpen()} onClose={() => setIsModalOpen(false)}>
        <h1 class='font-semibold text-lg'>New Connection</h1>
        <form onSubmit={onSubmit}>
          <div class='flex flex-col space-y-2'>
            <Input placeholder='Nickname' {...form.register('nickname')} />
            <Input placeholder='Host' {...form.register('host')} />
            <Input placeholder='Port' {...form.register('port')} />
            <Input placeholder='Username' {...form.register('username')} />
            <Input placeholder='Password' type='password' {...form.register('password')} />
            <Button type='submit'>Connect</Button>
          </div>
        </form>
      </Modal>
    </section>
  );
};
