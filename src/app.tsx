import {Link, useLocation, useRoutes} from 'solid-app-router';
import type {Component} from 'solid-js';
import {routes} from './routes';

const App: Component = () => {
  const location = useLocation();
  const Route = useRoutes(routes);

  return (
    <div class='min-h-screen'>
      {/* <nav class='bg-slate-800 text-gray-900 px-4'>
        <ul class='flex items-center'>
          <li class='py-2 px-4'>
            <Link href='/' class='no-underline hover:underline'>
              Home
            </Link>
          </li>
          <li class='py-2 px-4'>
            <Link href='/about' class='no-underline hover:underline'>
              About
            </Link>
          </li>
          <li class='py-2 px-4'>
            <Link href='/error' class='no-underline hover:underline'>
              Error
            </Link>
          </li>

          <li class='text-sm flex items-center space-x-1 ml-auto'>
            <span>URL:</span>
            <input
              class='w-75px p-1 bg-white text-sm rounded-lg'
              type='text'
              readOnly
              value={location.pathname}
            />
          </li>
        </ul>
      </nav> */}

      <main class='bg-app text-gray-200 min-h-screen flex flex-col'>
        <Route />
      </main>
    </div>
  );
};

export default App;
