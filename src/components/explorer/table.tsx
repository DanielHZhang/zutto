import type {JSXElement} from 'solid-js';
import {createEffect, For} from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import {CheckboxState} from 'src/components/base';
import {CheckboxColumn} from 'src/components/explorer/checkbox-column';
import {DataCell} from 'src/components/explorer/data-cell';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {clickOutside} from 'src/directives';
import type {CellData, ModificationsMap} from 'src/types';

type Props = {
  data: CellData[][];
  headers: string[];
  modifications: ModificationsMap;
  onCellEdit: (data: {row: number; col: number; value: string}) => void;
  onColumnRename: () => void;
  onDelete: () => void;
};

export const Table = (props: Props): JSXElement => {
  const [state, setState] = createStore({
    hover: {row: -1, col: -1},
    active: {x: -1, y: -1},
    selected: {row: -1, col: -1},
    selectedRows: {} as Record<number, boolean>,
  });

  const resetHover = () => setState('hover', {row: -1, col: -1});
  const resetActiveCell = () => setState('active', {x: -1, y: -1});
  const resetSelectedCell = () => setState('selected', {row: -1, col: -1});

  createEffect(() => {
    console.log('running when selected cellc hagnes', state.selected.row);
  });

  return (
    <div
      class='overflow-x-auto relative pb-2'
      use:clickOutside={() => {
        resetActiveCell();
        resetSelectedCell();
      }}
    >
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
            <div class='flex' onMouseOver={() => setState('hover', 'row', rowIndex())}>
              <CheckboxColumn
                onCheck={(checked) => {
                  setState(
                    produce((state) => {
                      if (checked === CheckboxState.Checked) {
                        state.selectedRows[rowIndex()] = true;
                      } else {
                        delete state.selectedRows[rowIndex()];
                      }
                    })
                  );
                }}
              />
              <For each={row}>
                {(data, colIndex) => (
                  <DataCell
                    data={data}
                    rowIndex={rowIndex()}
                    colIndex={colIndex()}
                    isSelected={
                      state.selected.row === rowIndex() && state.selected.col === colIndex()
                    }
                    isHovered={state.hover.row === rowIndex()}
                    isRowSelected={state.selectedRows[rowIndex()]}
                    isModified={!!props.modifications[`${rowIndex()},${colIndex()}`]}
                    onHover={(row, col) => setState('hover', {row, col})}
                    onClick={(event) => {
                      const target = event.currentTarget;
                      setState('active', {x: target.offsetLeft, y: target.offsetTop});

                      // Reset selected if clicking on an unselected cell
                      if (state.selected.row !== rowIndex() || state.selected.col !== colIndex()) {
                        resetSelectedCell();
                      }
                    }}
                    onDoubleClick={() => {
                      setState('selected', {row: rowIndex(), col: colIndex()});
                    }}
                    onEditInput={(event) => {
                      props.onCellEdit({
                        row: rowIndex(),
                        col: colIndex(),
                        value: event.currentTarget.value,
                      });
                    }}
                  />
                )}
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
