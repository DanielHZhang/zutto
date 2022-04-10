import type {JSXElement} from 'solid-js';
import {createSignal, For} from 'solid-js';
import {createStore} from 'solid-js/store';
import {Checkbox} from 'src/components/base';
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

  return (
    <div class='overflow-x-auto relative'>
      <div class='flex flex-col' onMouseLeave={() => setState('hover', {row: -1, col: -1})}>
        <div class='flex'>
          <For each={props.headers}>
            {(header) => (
              <div class='flex items-center border-l-2 border-b-2 border-t-2 border-gray-600 h-10 last:border-r-2'>
                <div class='w-40 overflow-hidden whitespace-nowrap overflow-ellipsis'>
                  <span class='px-2 font-semibold'>{header}</span>
                </div>
              </div>
            )}
          </For>
        </div>
        <For each={props.data}>
          {(row, rowIndex) => (
            <div class='flex'>
              <div class='flex items-center justify-center h-10 w-10 border-b-2 border-slate-700'>
                <Checkbox />
              </div>
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
        style={{
          left: `${state.selection.left}px`,
          top: `${state.selection.top}px`,
          visibility: state.selection.row >= 0 ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
};
