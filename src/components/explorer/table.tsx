import type {JSXElement} from 'solid-js';
import {createSignal, For} from 'solid-js';
import {createStore} from 'solid-js/store';
import {Column} from 'src/components/explorer/column';

type Data = {
  id: number;
  content: string;
};

type Props = {
  headers: string[];
  data: Data[][];
};

export const Table = (props: Props): JSXElement => {
  const [state, setState] = createStore({
    hover: {row: -1, col: -1},
    selection: {row: -1, col: -1, top: -1, left: -1},
  });
  // const [hover, setHover] = createSignal({row: -1, col: -1});
  // const [selection, setSelection] = createSignal({row: -1, col: -1, top: -1, left: -1});
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

  return (
    <div class='overflow-x-auto relative'>
      <div class='flex flex-col' onMouseLeave={() => setState('hover', {row: -1, col: -1})}>
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
                {(data, columnIndex) => (
                  <Column
                    data={data}
                    rowIndex={rowIndex()}
                    colIndex={columnIndex()}
                    isRowHovered={rowIndex() === state.hover.row}
                    isColHovered={columnIndex() === state.hover.col}
                    onHover={(row, col) => setState('hover', {row, col})}
                    onClick={(event) => {
                      const target = event.currentTarget;
                      setState('selection', {
                        row: rowIndex(),
                        col: columnIndex(),
                        top: target.offsetTop,
                        left: target.offsetLeft,
                      });
                    }}
                    onDoubleClick={(event) => {
                      console.log('on double clicked', event);
                    }}
                  />
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <div
        class='z-10 absolute h-10 w-41 border-3 border-blue-400 rounded-lg pointer-events-none'
        style={{left: `${state.selection.left}px`, top: `${state.selection.top}px`}}
      />
    </div>
  );
};
