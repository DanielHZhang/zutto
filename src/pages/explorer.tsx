import {JSXElement} from 'solid-js';
import {Button} from 'src/components/base';
import {Tabs} from 'src/components/explorer';

export default function Explorer(): JSXElement {
  return (
    <div class='flex flex-col'>
      <div class='flex'>
        <div>Home</div>
        <Tabs />
      </div>
      <section class='flex'>
        <Button>Refresh</Button>
        <div>Filters button</div>
        <div>Show number of records button</div>
        <Button>Add Record</Button>
        <Button>Save Changes</Button>
      </section>
      <main>
        <div>Table here</div>
      </main>
    </div>
  );
}
