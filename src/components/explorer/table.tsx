import {createSignal, For, JSXElement} from 'solid-js';

type Data = {
  id: number;
  content: string;
};

type Props = {
  headers: string[];
  data: Data[][];
};

export const Table = (props: Props): JSXElement => {
  const [hover, setHover] = createSignal({row: -1, col: -1});
  const [selection, setSelection] = createSignal({
    start: {row: -1, col: -1},
    end: {row: -1, col: -1},
  });

  const minColumns = 10;
  const minRows = 10;

  const normalize = () => {
    const numRows = props.data.length;

    const missingRows = minRows - numRows;
    if (missingRows > 0) {
      const fillData = Array.from({length: missingRows}, () => []);
      props.data.push(...fillData);
    }

    props.data.forEach((row) => {
      const numCols = row.length;
      const missingCols = minColumns - numCols;
      const fillData = Array.from({length: missingCols}, () => ({
        id: -1,
        content: '',
      }));
      row.push(...fillData);
    });

    return props.data;
  };

  /** @tw */
  const borders = 'border-l-2 border-b-2 border-gray-600';

  return (
    <div class='overflow-x-auto'>
      <div class='flex flex-col w-300' onMouseLeave={() => setHover({row: -1, col: -1})}>
        <For each={props.headers}>{(header) => <div class='flex'>{header}</div>}</For>
        <For each={normalize()}>
          {(row, rowIndex) => (
            <div class='flex'>
              <For each={row}>
                {(column, columnIndex) => (
                  <div
                    class={[
                      'flex',
                      'items-center',
                      'h-10',
                      borders,
                      rowIndex() === hover().row ? 'bg-blue-500 bg-opacity-20' : '',
                    ].join(' ')}
                    onMouseOver={() => {
                      setHover({row: rowIndex(), col: columnIndex()});
                    }}
                  >
                    <div class='w-40 overflow-hidden whitespace-nowrap overflow-ellipsis'>
                      <span class='px-2'>{column.content}</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
