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
  const [selection, setSelection] = createSignal({row: -1, col: -1, top: -1, left: -1});
  // const [selection, setSelection] = createSignal({
  //   start: {row: -1, col: -1},
  //   end: {row: -1, col: -1},
  // });

  const minColumns = 6;
  const minRows = 10;

  const normalizeData = () => {
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

  const normalizeHeaders = () => {
    const missingCols = minColumns - props.headers.length;
    if (missingCols > 0) {
      props.headers.push(...Array.from({length: missingCols}, () => ''));
    }
    return props.headers;
  };

  // const getPosition = () => {
  //   if (selection().bottom === -1) {
  //     return '';
  //   }
  //   return `bottom-[${selection().bottom}px] left-[${selection().left}px]`;
  // };

  /** @tw */
  const borders = 'border-l-2 border-b-2 border-gray-600 last-of-type:border-r-2';

  return (
    <div class='overflow-x-auto relative'>
      <div class='flex flex-col' onMouseLeave={() => setHover({row: -1, col: -1})}>
        <div class='flex'>
          <For each={normalizeHeaders()}>
            {(header) => (
              <div class='flex items-center border-l-2 border-b-4 border-t-2 border-gray-600 h-10 last-of-type:border-r-2'>
                <div class='w-40 overflow-hidden whitespace-nowrap overflow-ellipsis'>
                  <span class='px-2 font-semibold'>{header}</span>
                </div>
              </div>
            )}
          </For>
        </div>
        <For each={normalizeData()}>
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
                      // rowIndex() === selection().row && columnIndex() === selection().col
                      //   ? 'border-blue-400 border-t-2 border-r-2 rounded-md'
                      //   : '',
                    ].join(' ')}
                    onMouseOver={() => setHover({row: rowIndex(), col: columnIndex()})}
                    onClick={(event) => {
                      // console.log(event.currentTarget);
                      // const {top, left, x, y, height, width} =
                      // event.currentTarget.getBoundingClientRect();
                      // console.log(event.currentTarget.getBoundingClientRect());
                      // setSelection({row: rowIndex(), col: columnIndex(), top: y - height, left});
                      const target = event.currentTarget;
                      setSelection({
                        row: rowIndex(),
                        col: columnIndex(),
                        top: target.offsetTop,
                        left: target.offsetLeft,
                      });
                    }}
                  >
                    <div class='w-40 px-2 overflow-hidden whitespace-nowrap overflow-ellipsis'>
                      <span class='text-gray-300'>{column.content}</span>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <div
        class='z-10 absolute h-10 w-41 border-3 border-blue-400 rounded-lg'
        style={{top: `${selection().top}px`, left: `${selection().left}px`}}
      />
    </div>
  );
};
