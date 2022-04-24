/* @refresh reload */
import {Router} from 'solid-app-router';
import {render} from 'solid-js/web';
import {GlobalStyles} from 'src/styles';
import 'windi.css';
import App from './app';

render(
  () => (
    <Router>
      <GlobalStyles />
      <App />
    </Router>
  ),
  document.getElementById('root')!
);
