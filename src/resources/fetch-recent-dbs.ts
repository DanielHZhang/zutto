import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';

export async function fetchRecentDatabases(): Promise<any> {
  if (IS_TAURI_ENV) {
    return;
  }
  const {databases} = await invoke('getRecentDatabases');
  return databases;
}
