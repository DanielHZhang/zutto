import type {JSX, JSXElement} from 'solid-js';
import {For, Index, useContext} from 'solid-js';
import {createStore, produce} from 'solid-js/store';
import {CheckboxState} from 'src/components/base';
import {CheckboxColumn} from 'src/components/explorer/checkbox-column';
import {Cell} from 'src/components/explorer/table/cell';
import {DataCell} from 'src/components/explorer/table/data-cell';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {clickOutside} from 'src/directives';
import {RootContext} from 'src/stores';
import {zIndex} from 'src/styles';

const handledKeys = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter']);

type Props = {
  tableName: string;
};

export const Table = (props: Props): JSXElement => {
  const [root, setRoot] = useContext(RootContext);
  const [state, setState] = createStore({
    hover: {row: -1, col: -1},
    active: {row: -1, col: -1, x: -1, y: -1},
    selected: {row: -1, col: -1},
    selectedRows: {} as Record<number, boolean>,
  });

  const currentTable = () => root.tables[props.tableName] || {headers: [], data: []};
  const resetHover = () => setState('hover', {row: -1, col: -1});
  const resetActiveCell = () => setState('active', {row: -1, col: -1, x: -1, y: -1});
  const resetSelectedCell = () => setState('selected', {row: -1, col: -1});

  const onKeyDown: JSX.EventHandlerUnion<HTMLDivElement, KeyboardEvent> = (event) => {
    setState(
      produce((state) => {
        if (!handledKeys.has(event.key)) {
          return;
        }

        // const currentTable = global.tables[props.tableName];
        const {row, col} = state.active; // Get original row and col
        switch (event.key) {
          case 'ArrowLeft': {
            if (state.active.col > 0) {
              state.active.col -= 1;
            }
            break;
          }
          case 'ArrowRight': {
            if (state.active.col < currentTable().headers.length - 1) {
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
            if (state.active.row < currentTable().data.length - 1) {
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

  return (
    <div
      class='relative pb-1 outline-none overflow-y-auto'
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseLeave={resetHover}
      use:clickOutside={() => {
        resetActiveCell();
        resetSelectedCell();
      }}
    >
      <div
        class={`${zIndex.SELECTED_CELL} absolute border-2 border-blue-400 pointer-events-none`}
        style={{
          height: '38px',
          width: '206px',
          left: `${state.active.x + 2}px`,
          top: `${state.active.y}px`,
          visibility: state.active.row !== -1 && state.active.col !== -1 ? 'visible' : 'hidden',
        }}
      />
      <div class={`${zIndex.ROW_HEADER} flex sticky top-0`}>
        <CheckboxColumn isHeader={true} />
        <div class='flex'>
          <For each={currentTable().headers}>
            {(header) => (
              <Cell class='border-t-2 bg-app shadow-light-down'>
                <span class='px-2 font-semibold'>{header}</span>
              </Cell>
            )}
          </For>
        </div>
      </div>
      <Index each={currentTable().data}>
        {(rowData, row) => (
          <div class='flex flex-shrink-0' onMouseOver={() => setState('hover', 'row', row)}>
            <CheckboxColumn
              onCheck={(checked) => {
                setState(
                  produce((state) => {
                    if (checked === CheckboxState.Checked) {
                      state.selectedRows[row] = true;
                    } else {
                      delete state.selectedRows[row];
                    }
                  })
                );
              }}
            />
            <Index each={rowData()}>
              {(cellData, col) => (
                <DataCell
                  content={cellData()}
                  rowIndex={row}
                  colIndex={col}
                  isSelected={state.selected.row === row && state.selected.col === col}
                  isHovered={state.hover.row === row}
                  isRowSelected={state.selectedRows[row]}
                  isModified={Boolean(currentTable().modifications[`${row},${col}`])}
                  onHover={(row, col) => setState('hover', {row, col})}
                  onClick={(event) => {
                    const target = event.currentTarget;
                    setState('active', {row, col, x: target.offsetLeft, y: target.offsetTop});

                    // Reset selected if clicking on an unselected cell
                    if (state.selected.row !== row || state.selected.col !== col) {
                      resetSelectedCell();
                    }
                  }}
                  onDoubleClick={() => setState('selected', {row: row, col: col})}
                  onEditInput={(event) => {
                    event.stopPropagation();

                    setRoot(
                      produce((state) => {
                        const index = `${row},${col}` as const;
                        const {modifications, data} = state.tables[props.tableName];
                        const newValue = event.currentTarget.value;

                        if (modifications[index]) {
                          modifications[index].newValue = newValue;
                        } else {
                          modifications[index] = {
                            originalValue: cellData(),
                            newValue,
                          };
                        }

                        data[row][col] = newValue;
                        data[row] = [...data[row]];
                      })
                    );
                  }}
                  onEditKeyDown={(event) => {
                    event.stopPropagation();
                    if (event.key === 'Enter' || event.key === 'Escape') {
                      resetSelectedCell();
                    }
                  }}
                />
              )}
            </Index>
          </div>
        )}
      </Index>
    </div>
  );
};
