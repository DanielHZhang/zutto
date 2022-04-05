import {actions} from 'src/components/actions';
import {IS_TAURI_ENV} from 'src/config';
import {invokeTauri} from 'src/utils/tauri';

const tableData = Array.from({length: 10}, (_, index) => ({
  name: `Table ${index}`,
}));

export async function fetchAllTables(): Promise<any> {
  if (!IS_TAURI_ENV) {
    return tableData;
  }
  const data = await invokeTauri(actions.fetchAllTables);
  return data;
}
