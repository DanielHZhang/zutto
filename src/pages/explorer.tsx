import type {JSXElement} from 'solid-js';
import {ErrorBoundary, Suspense} from 'solid-js';
import {Logo} from 'src/components/base';
import {ErrorContainer} from 'src/components/error';
import {TableDataWrapper, Tabs} from 'src/components/explorer';

export default function Explorer(): JSXElement {
  return (
    <div class='flex flex-col h-screen'>
      <ErrorBoundary fallback={ErrorContainer}>
        <header class='flex flex-grow-0 basis-14 bg-header border-gray border-b-1'>
          <Logo href='/tables' class='px-4 border-gray border-r-1' />
          <Suspense fallback={<div>Loading...</div>}>
            <Tabs />
          </Suspense>
        </header>
        <main class='flex flex-col min-h-0'>
          <Suspense fallback={<div>Loading...</div>}>
            <TableDataWrapper />
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  );
}
