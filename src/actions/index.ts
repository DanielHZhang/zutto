import {IS_TAURI_ENV} from 'src/config';
import {ConnectionConfig} from 'src/types';
import {invokeTauri} from 'src/utils/tauri';

export async function connectToDatabase(data: ConnectionConfig): Promise<any> {
  return invokeTauri('connect_to_database', {data});
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
  return invokeTauri<ConnectionConfig[]>('fetch_recent_databases');
}

type TableData = {name: string}[];

export async function fetchAllTables(): Promise<TableData | null> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 10}, (_, index) => ({
      name: `Table ${index}`,
    }));
  }
  return invokeTauri<TableData | null>('fetch_all_tables');
}

export async function fetchTableData(tableName: string): Promise<any> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 10}, (_, index) => ({
      name: `Table ${index}`,
    }));
  }
  return invokeTauri('fetch_table_data', {tableName});
}
