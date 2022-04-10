import type {JSX, JSXElement} from 'solid-js';

type Props = {
  data: {id: number; content: string};
  rowIndex: number;
  colIndex: number;
  isRowHovered: boolean;
  isColHovered: boolean;
  onHover: (rowIndex: number, colIndex: number) => void;
  onClick: JSX.EventHandler<HTMLDivElement, MouseEvent>;
  onDoubleClick: JSX.EventHandler<HTMLDivElement, MouseEvent>;
};

export const Column = (props: Props): JSXElement => {
  const isEmpty = () => props.data.content === '' && props.data.id === -1;

  /** @tw */
  const borders = 'border-l-2 border-b-2 border-slate-700 last:border-r-2';

  /** @tw */
  // const empty = 'border-gray-800  first-of-type:border-l-gray-600';

  return (
    <div
      classList={{
        // [empty]: isEmpty(),
        'bg-blue-500 bg-opacity-20': props.isRowHovered,
      }}
      class={`flex items-center h-10 ${borders}`}
      onMouseOver={() => props.onHover(props.rowIndex, props.colIndex)}
      onClick={(event) => {
        props.onClick(event);
      }}
      onDblClick={props.onDoubleClick}
    >
      <div class='w-40 px-2 overflow-hidden whitespace-nowrap overflow-ellipsis select-none'>
        <span class='text-gray-300'>{props.data.content}</span>
      </div>
    </div>
  );
};