import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';
import {ConnectionConfig, PublicConnectionConfig, RenamePayload, TableOverview} from 'src/types';

type ConnectData = {id: string} | {config: ConnectionConfig};

export async function connectToDatabase(data: ConnectData): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('connect_to_database', {data});
}

export async function renameDatabase(rename: RenamePayload): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('rename_database', {rename});
}

export async function queryRecentDatabases(): Promise<PublicConnectionConfig[] | null> {
  if (!IS_TAURI_ENV) {
    return [
      {
        id: '1',
        name: 'Testing db',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        databaseName: 'database',
      },
      {
        id: '1',
        name: 'Testing db',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        databaseName: 'database',
      },
    ];
  }
  return invoke('query_recent_databases');
}

export async function queryAllTables(): Promise<TableOverview[]> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 10}, (_, index) => ({
      name: `Table ${index}`,
      numRecords: index,
      numColumns: index,
    }));
  }
  return invoke('query_all_tables');
}

export async function queryTableData(tableName: string): Promise<any> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 10}, (_, index) => ({
      name: `Table ${index}`,
    }));
  }
  return invoke('query_table_data', {tableName});
}
