import {invoke} from '@tauri-apps/api';
import {actions} from 'src/components/actions';
import {IS_TAURI_ENV} from 'src/config';
import {ConnectionData} from 'src/types';

export async function fetchRecentDatabases(): Promise<ConnectionData[]> {
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
  try {
    const data = await invoke(actions.fetchRecentDatabases);
    console.log('returned data', data);
    return data;
  } catch (error) {
    console.log('ERROR:', error);
  }
}
