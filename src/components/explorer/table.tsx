import {For, JSXElement} from 'solid-js';

type Data = {
  id: number;
  content: string;
};

type Props = {
  data: Data[][];
};

export const Table = (props: Props): JSXElement => {
  const minColumns = 10;
  const minRows = 10;

  const normalize = () => {
    const numRows = props.data.length;
    const numCols = props.data[0].length;

    const missingRows = minRows - numRows;
    if (missingRows > 0) {
      const fillData = Array.from({length: missingRows}, () => []);
      props.data.push(...fillData);
    }

    const missingCols = minColumns - numCols;
    if (missingCols > 0) {
      props.data.forEach((row) => {
        const fillData = Array.from({length: missingCols}, () => ({
          id: -1,
          content: '',
        }));
        row.push(...fillData);
      });
    }
  };

  const blanks = () => {
    if (props.data.length > minRows) {
      const numberMissing = minRows - props.data.length;
      const blankRowsAndColumns = Array.from({length: numberMissing}, (_, index) => {
        const missingColumns = minColumns - props.data[index].length;
        return Array.from({length: missingColumns}, (_, index) => ({
          id: -1,
          content: '',
        }));
      });
    }
    return undefined;
  };

  const blankColumns = () => {
    if (props.data[0].length > minColumns) {
      return;
    }
    return Array.from({length: minColumns - props.data[0].length}, (_, index) => ({
      id: -1,
      content: '',
    }));
  };

  return (
    <div class='flex flex-col'>
      <For each={props.data}>
        {(row) => (
          <For each={row}>
            {(column) => (
              <div class='flex'>
                <div>{column.content}</div>
              </div>
            )}
          </For>
        )}
      </For>
    </div>
  );
};
