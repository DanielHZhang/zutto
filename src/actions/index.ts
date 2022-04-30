import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';
import type {
  ConnectionConfig,
  CreateTablePayload,
  DeleteTablePayload,
  PublicConnectionConfig,
  QueryDataPayload,
  RenameTablePayload,
  TableData,
  TableOverview,
} from 'src/types';

export async function beginConnection(data: {id: string} | {config: ConnectionConfig}): Promise<string> {
  if (!IS_TAURI_ENV) {
    return 'uuid';
  }
  return invoke('begin_connection', {data});
}

export async function closeConnection(): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('close_connection');
}

export async function editConnection(config: ConnectionConfig): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('edit_connection', {config});
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

export async function deleteTable(payload: DeleteTablePayload): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('delete_table', {payload});
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
      name: `Table ${index} long name`,
      numRecords: index * 100,
      numColumns: index,
    }));
  }
  return invoke('query_all_tables');
}

export async function queryTableData(payload: QueryDataPayload): Promise<TableData> {
  if (!IS_TAURI_ENV) {
    const headers = ['Name', 'Date', 'Description', 'Age', 'Job'];
    const data = Array.from({length: 25}, (_, index) => [
      'John',
      '2019-01-01',
      'Lorem ipsum dolor sit amet',
      `${1 + index}`,
      'Engineer',
    ]);
    return {headers, data};
  }
  return invoke('query_table_data', {payload});
}

export async function openTab(data: {id: string; tableName: string}): Promise<string[]> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 5}, (_, index) => `Table ${index} long name`);
  }
  return invoke('open_tab', {connectionId: data.id, tableName: data.tableName});
}

export async function closeTab(id: string, tableName: string): Promise<void> {
  if (!IS_TAURI_ENV) {
    return;
  }
  return invoke('close_tab', {connectionId: id, tableName});
}

export async function fetchTabs(id: string): Promise<string[]> {
  if (!IS_TAURI_ENV) {
    return Array.from({length: 5}, (_, index) => `Table ${index} long name`);
  }
  return invoke('fetch_tabs', {connectionId: id});
}
