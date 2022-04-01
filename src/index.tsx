/* @refresh reload */
import {Router} from 'solid-app-router';
import {render} from 'solid-js/web';
import 'windi.css';
import App from './app';

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root')
);
