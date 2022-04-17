import type {JSX, JSXElement} from 'solid-js';
import {For} from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import {CheckboxState} from 'src/components/base';
import {CheckboxColumn} from 'src/components/explorer/checkbox-column';
import {DataCell} from 'src/components/explorer/table/data-cell';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {clickOutside} from 'src/directives';
import type {ModificationsMap} from 'src/types';

const handledKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter']);

type Props = {
  data: string[][];
  headers: string[];
  modifications: ModificationsMap;
  onCellEdit: (data: {row: number; col: number; value: string}) => void;
  onColumnRename: () => void;
  onDelete: () => void;
};

export const Table = (props: Props): JSXElement => {
  const [state, setState] = createStore({
    hover: {row: -1, col: -1},
    active: {row: -1, col: -1, x: -1, y: -1},
    selected: {row: -1, col: -1},
    selectedRows: {} as Record<number, boolean>,
  });

  const resetHover = () => setState('hover', {row: -1, col: -1});
  const resetActiveCell = () => setState('active', {row: -1, col: -1, x: -1, y: -1});
  const resetSelectedCell = () => setState('selected', {row: -1, col: -1});

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (event) => {
    setState(
      produce((state) => {
        if (!handledKeys.has(event.key)) {
          return;
        }
        const {row, col} = state.active; // Get original row and col
        switch (event.key) {
          case 'ArrowLeft': {
            if (state.active.col > 0) {
              state.active.col -= 1;
            }
            break;
          }
          case 'ArrowRight': {
            if (state.active.col < props.headers.length - 1) {
              state.active.col += 1;
            }
            break;
          }
          case 'ArrowUp': {
            if (state.active.row > 0) {
              state.active.row -= 1;
            }
            break;
          }
          case 'ArrowDown': {
            if (state.active.row < props.data.length - 1) {
              state.active.row += 1;
            }
            break;
          }
          case 'Enter': {
            event.preventDefault(); // Prevent input field from immediately handling "Enter"
            state.selected = {
              row: state.active.row,
              col: state.active.col,
            };
            break;
          }
        }

        if (row !== state.active.row || col !== state.active.col) {
          const element = document.querySelector<HTMLElement>(
            `div[data-row="${state.active.row}"][data-col="${state.active.col}"]`
          )!;
          state.active.x = element.offsetLeft;
          state.active.y = element.offsetTop;
        }
      })
    );
  };

  const onCellClick =
    (row: number, col: number): JSX.EventHandler<HTMLDivElement, MouseEvent> =>
    (event) => {
      const target = event.currentTarget;
      setState('active', {row, col, x: target.offsetLeft, y: target.offsetTop});

      // Reset selected if clicking on an unselected cell
      if (state.selected.row !== row || state.selected.col !== col) {
        resetSelectedCell();
      }
    };

  return (
    <div
      class='flex flex-col overflow-x-auto relative pb-1 outline-none'
      tabIndex={0}
      onKeyDown={onKeyDown}
      use:clickOutside={() => {
        resetActiveCell();
        resetSelectedCell();
      }}
      onMouseLeave={resetHover}
    >
      <div
        class='z-20 absolute border-3 border-blue-400 rounded-lg pointer-events-none'
        style={{
          height: '46px',
          width: '208px',
          left: `${state.active.x - 2}px`,
          top: `${state.active.y - 4}px`,
          visibility: state.active.row !== -1 && state.active.col !== -1 ? 'visible' : 'hidden',
        }}
      />
      <div class='flex'>
        <CheckboxColumn isHeader={true} />
        <div class='flex ml-10'>
          <For each={props.headers}>
            {(header) => (
              <div class='flex items-center border-l-2 border-b-2 border-t-2 border-slate-700 h-10 last:border-r-2'>
                <div class='w-50 overflow-hidden whitespace-nowrap overflow-ellipsis'>
                  <span class='px-2 font-semibold'>{header}</span>
                </div>
              </div>
            )}
          </For>
        </div>
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
            <div class='flex ml-10'>
              <For each={row}>
                {(data, colIndex) => (
                  <DataCell
                    content={data}
                    rowIndex={rowIndex()}
                    colIndex={colIndex()}
                    isSelected={state.selected.row === rowIndex() && state.selected.col === colIndex()}
                    isHovered={state.hover.row === rowIndex()}
                    isRowSelected={state.selectedRows[rowIndex()]}
                    isModified={!!props.modifications[`${rowIndex()},${colIndex()}`]}
                    onHover={(row, col) => setState('hover', {row, col})}
                    onClick={onCellClick(rowIndex(), colIndex())}
                    onDoubleClick={() => setState('selected', {row: rowIndex(), col: colIndex()})}
                    onEditInput={(event) => {
                      props.onCellEdit({
                        row: rowIndex(),
                        col: colIndex(),
                        value: event.currentTarget.value,
                      });
                    }}
                    onEditKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === 'Escape') {
                        resetSelectedCell();
                      }
                    }}
                  />
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
