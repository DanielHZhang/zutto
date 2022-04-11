import {useRoutes} from 'solid-app-router';
import type {Component} from 'solid-js';
import {routes} from 'src/routes';

const App: Component = () => {
  const Route = useRoutes(routes);

  return (
    <main class='bg-app text-gray-200 min-h-screen flex flex-col'>
      <Route />
    </main>
  );
};

export default App;
