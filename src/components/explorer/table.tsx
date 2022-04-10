import type {JSXElement} from 'solid-js';
import {createSelector, createSignal, For} from 'solid-js';
import {createStore} from 'solid-js/store';
import type {CheckboxState} from 'src/components/base';
import {CheckboxColumn} from 'src/components/explorer/checkbox-column';
import {DataCell} from 'src/components/explorer/data-cell';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {clickOutside} from 'src/directives';

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
    active: {x: -1, y: -1},
    selected: {row: -1, col: -1},
  });

  const resetHover = () => setState('hover', {row: -1, col: -1});
  const resetActiveCell = () => setState('active', {x: -1, y: -1});

  return (
    <div class='overflow-x-auto relative pb-2' use:clickOutside={resetActiveCell}>
      <div class='flex flex-col' onMouseLeave={resetHover}>
        <div class='flex'>
          <CheckboxColumn isHeader={true} />
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
              <CheckboxColumn
                onCheck={(checked: CheckboxState) => {
                  console.log('new state:', checked);
                }}
              />
              <For each={row}>
                {(data, colIndex) => {
                  return (
                    <DataCell
                      data={data}
                      rowIndex={rowIndex()}
                      colIndex={colIndex()}
                      isSelected={
                        state.selected.row === rowIndex() && state.selected.col === colIndex()
                      }
                      isHovered={state.hover.row === rowIndex()}
                      onHover={(row, col) => setState('hover', {row, col})}
                      onClick={(event) => {
                        const target = event.currentTarget;
                        setState('active', {x: target.offsetLeft, y: target.offsetTop});
                      }}
                      onDoubleClick={() => {
                        setState('selected', {row: rowIndex(), col: colIndex()});
                      }}
                    />
                  );
                }}
              </For>
            </div>
          )}
        </For>
      </div>
      <div
        class='z-10 absolute border-3 border-blue-400 rounded-lg pointer-events-none'
        style={{
          height: '46px',
          width: '208px',
          left: `${state.active.x - 2}px`,
          top: `${state.active.y - 4}px`,
          visibility: state.active.x !== -1 && state.active.y !== -1 ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
};
