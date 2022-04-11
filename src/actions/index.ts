import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';
import type {
  ConnectionConfig,
  CreateTablePayload,
  PublicConnectionConfig,
  RenameTablePayload,
  TableData,
  TableOverview,
} from 'src/types';

export async function connectToDatabase(
  data: {id: string} | {config: ConnectionConfig}
): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('connect_to_database', {data});
}

export async function deleteConnection(id: string): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('delete_connection', {id});
}

export async function createTable(table: CreateTablePayload): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('create_table', {table});
}

export async function renameTable(rename: RenameTablePayload): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('rename_table', {rename});
}

export async function queryRecentDatabases(): Promise<PublicConnectionConfig[]> {
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

export async function queryTableData(tableName: string): Promise<TableData> {
  if (!IS_TAURI_ENV) {
    throw new Error('lol');
    const headers = ['Name', 'Date', 'Description'];
    const data = [
      [
        {id: 123, content: 'some string'},
        {id: 123, content: 'some string really really long content'},
        {id: 123, content: 'some string'},
      ],
      [
        {id: 234, content: 'more string'},
        {id: 234, content: 'more string'},
        {id: 234, content: 'more string'},
      ],
    ];
    return {headers, data};
  }
  const data = await invoke('query_table_data', {payload: {tableName, offset: 0}});
  console.log('got data:', data);
  return data;
}
