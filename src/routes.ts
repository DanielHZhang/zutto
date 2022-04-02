import type { RouteDefinition } from 'solid-app-router';
import { lazy } from 'solid-js';
import {Home, Tables} from 'src/pages';
// import AboutData from './pages/about.data';
// import Home from './pages/home';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
	{
		path: '/tables',
		component:Tables,
	},
  // {
  //   path: '/about',
  //   component: lazy(async () => import('./pages/about')),
  //   data: AboutData,
  // },
  {
    path: '**',
    component: lazy(async () => import('./errors/404')),
  },
];
