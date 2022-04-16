import type {RouteDefinition} from 'solid-app-router';
import {lazy} from 'solid-js';

export * from './link';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(async () => import('src/pages/home')),
  },
  {
    path: '/tables',
    component: lazy(async () => import('src/pages/tables')),
  },
  {
    path: '/explorer/:tableName',
    component: lazy(async () => import('src/pages/explorer')),
  },
  {
    path: '**',
    component: lazy(async () => import('src/pages/not-found')),
  },
];
