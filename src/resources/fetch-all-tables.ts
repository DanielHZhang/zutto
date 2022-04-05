import {actions} from 'src/components/actions';
import {invokeTauri} from 'src/utils/tauri';

export async function fetchAllTables(): Promise<any> {
  const data = await invokeTauri(actions.fetchAllTables);
  return data;
}
