import {createSignal, For, JSXElement} from 'solid-js';
import {Button, Input, Modal} from 'src/components/base';
import {ActionCard, DatabaseCard} from 'src/components/home';

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
  const [isModalOpen, setIsModalOpen] = createSignal(false);

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
        <div class='flex flex-col space-y-2'>
          <h1 class='font-semibold text-lg'>New Connection</h1>
          <Input placeholder='Nickname' />
          <Input placeholder='Host' />
          <Input placeholder='Port' />
          <Input placeholder='Username' />
          <Input placeholder='Password' />
          <Button>Connect</Button>
        </div>
      </Modal>
    </section>
  );
};
