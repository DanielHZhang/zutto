import {invoke} from '@tauri-apps/api';
import {actions} from 'src/components/actions';
import {IS_TAURI_ENV} from 'src/config';
import {ConnectionConfig} from 'src/types';

export async function fetchRecentDatabases(): Promise<ConnectionConfig[]> {
  if (!IS_TAURI_ENV) {
    return [
      {
        name: 'Testing db',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        databaseName: 'database',
      },
      {
        name: 'Testing db',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        databaseName: 'database',
      },
    ];
  }
  return invoke(actions.fetchRecentDatabases);
}
