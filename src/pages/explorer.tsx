import {useParams} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createEffect, ErrorBoundary, onMount, Suspense, useContext} from 'solid-js';
import {openTab} from 'src/actions';
import {Logo} from 'src/components/base';
import {ErrorContainer} from 'src/components/error';
import {TableDataWrapper, Tabs} from 'src/components/explorer';
import {GlobalContext} from 'src/stores';

export default function Explorer(): JSXElement {
  // const params = useParams();
  // const [global] = useContext(GlobalContext);

  // onMount(async () => {
  //   const tableName = decodeURIComponent(params.tableName);
  //   await openTab(global.connection.id, tableName);
  //   console.log('on mount finishes');
  // });

  // createEffect(() => {
  //   console.log('what are params:', params.tableName);
  //   console.log(decodeURIComponent(params.tableName));
  // });

  // createEffect(() => {
  //   console.log(tableData());
  // });

  return (
    <div class='flex flex-col space-y-2'>
      <div class='flex bg-header h-14 border-gray border-b-1'>
        <Logo href='/tables' class='px-4 border-gray border-r-1' />
        <Suspense fallback={<div>Loading...</div>}>
          <Tabs />
        </Suspense>
      </div>
      <ErrorBoundary fallback={ErrorContainer}>
        <Suspense fallback={<div>Loading...</div>}>
          <TableDataWrapper />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
