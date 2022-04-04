import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';
import {isObject} from 'src/utils';

export * from './fetch-recent-dbs';

export enum actions {
  connectToDatabase = 'connect_to_database',
}

export async function invokeTauri<T>(action: actions, data: any): Promise<T | null> {
  if (!IS_TAURI_ENV) {
    console.info('[invoke] skipped outside tauri env:', action);
    return null;
  }
  // Remove proxies from object data by spreading
  return invoke(action, {data: isObject(data) ? {...data} : data});
}
