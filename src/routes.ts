import type {RouteDefinition} from 'solid-app-router';
import {lazy} from 'solid-js';
import AboutData from './pages/about.data';
import Home from './pages/home';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(async () => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '**',
    component: lazy(async () => import('./errors/404')),
  },
];
