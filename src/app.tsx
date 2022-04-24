import {useRoutes} from 'solid-app-router';
import type {Component} from 'solid-js';
import {routes} from 'src/routes';
import {GlobalProvider} from 'src/stores';

const App: Component = () => {
  const Route = useRoutes(routes);

  return (
    <GlobalProvider>
      <Route />
    </GlobalProvider>
  );
};

export default App;
