import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';
import {ConnectionConfig} from 'src/types';

export async function connectToDatabase(data: ConnectionConfig): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('connect_to_database', {data});
}

export async function fetchRecentDatabases(): Promise<ConnectionConfig[] | null> {
  if (!IS_TAURI_ENV) {
    return [
      {
        name: 'Testing db',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: '',
        databaseName: 'database',
      },
    ];
  }
  return invoke('fetch_recent_databases');
}

type TableData = string[];

export async function fetchAllTables(): Promise<TableData> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 10}, (_, index) => `Table ${index}`);
  }
  return invoke<TableData>('fetch_all_tables');
}

export async function fetchTableData(tableName: string): Promise<any> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 10}, (_, index) => ({
      name: `Table ${index}`,
    }));
  }
  return invoke('fetch_table_data', {tableName});
}