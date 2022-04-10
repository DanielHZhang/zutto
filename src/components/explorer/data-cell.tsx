import type {JSX, JSXElement} from 'solid-js';
import {createEffect, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {Button, Input} from 'src/components/base';
import OpenNewWindowIcon from 'src/components/icons/open-new-window.svg';

type Props = {
  data: {id: number; content: string};
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  isHovered: boolean;
  onHover: (rowIndex: number, colIndex: number) => void;
  onClick: JSX.EventHandler<HTMLDivElement, MouseEvent>;
  onDoubleClick: JSX.EventHandler<HTMLDivElement, MouseEvent>;
};

export const DataCell = (props: Props): JSXElement => {
  let editInput: HTMLInputElement;
  createEffect(() => {
    if (props.isSelected) {
      editInput.focus();
    }
  });

  /** @tw */
  const borders = 'border-l-2 border-b-2 border-slate-700 last:border-r-2';

  /** @tw */
  const height = 'h-10';
  /** @tw */
  const width = 'w-50';

  return (
    <div
      classList={{
        'bg-blue-500 bg-opacity-20': props.isHovered,
      }}
      class={`flex items-center ${height} ${borders}`}
      onMouseOver={() => props.onHover(props.rowIndex, props.colIndex)}
      onClick={(event) => {
        props.onClick(event);
      }}
      onDblClick={props.onDoubleClick}
    >
      <div
        class={`${width} relative overflow-hidden whitespace-nowrap overflow-ellipsis select-none`}
      >
        <Show
          when={props.isSelected}
          fallback={<span class='text-gray-300 px-2'>{props.data.content}</span>}
        >
          <Input
            ref={(element) => (editInput = element)}
            class={`${height} ${width} pr-8 py-0 rounded-none`}
            value={props.data.content}
          />
          <div class='absolute right-1 top-2'>
            <Button size='xs'>
              <OpenNewWindowIcon width='16px' height='16px' />
            </Button>
          </div>
        </Show>
      </div>
    </div>
  );
};
