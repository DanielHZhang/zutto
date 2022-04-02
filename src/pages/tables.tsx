import {JSXElement} from 'solid-js';
import {Grid} from 'src/components/base';

const tableData = Array.from({length: 100}, (_, index) => ({
  name: `Table name ${index}`,
}));

export const Tables = (): JSXElement => {
  return (
    <div>
      Tables
      <Grid items={tableData}>
        {(item) => (
          <div class='p-2 sm:w-1/3'>
            <div class='bg-slate-700 rounded-md p-4'>{item.name}</div>
          </div>
        )}
      </Grid>
    </div>
  );
};
