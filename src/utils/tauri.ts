import {invoke} from '@tauri-apps/api';
import {IS_TAURI_ENV} from 'src/config';

export async function invokeTauri<T>(action: string, data?: Record<string, any>): Promise<T> {
  if (!IS_TAURI_ENV) {
    console.info('[invoke] skipped outside tauri env:', action);
    return null;
  }
  // Remove proxies from object data by spreading
  return invoke(action, data);
}
