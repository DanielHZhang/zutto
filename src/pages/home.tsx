import {createSignal, For, JSXElement} from 'solid-js';
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

export default function Home(): JSXElement {
  const [count, setCount] = createSignal(0);

  return (
    <section class='flex flex-grow-1 flex-col space-y-10 text-gray-200 p-8'>
      <h1 class='text-3xl font-bold'>Databases</h1>
      <div>
        <ActionCard type='' />
      </div>
      <div class='flex space-x-4'>
        <For each={data}>{(item) => <DatabaseCard {...item} />}</For>
      </div>
    </section>
  );
}
