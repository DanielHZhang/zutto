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
  /** @tw */
  const borders = 'border-l-2 border-b-2 border-gray-600 last-of-type:border-r-2';

  return (
    <div
      classList={{
        'bg-blue-500 bg-opacity-20': props.isRowHovered,
      }}
      class={`flex items-center h-10 first:border-l-transparent last:border-r-transparent ${borders}`}
      onMouseOver={() => props.onHover(props.rowIndex, props.colIndex)}
      onClick={(event) => {
        console.log('click event');
        props.onClick(event);
      }}
      onDblClick={props.onDoubleClick}
    >
      <div class='w-40 px-2 overflow-hidden whitespace-nowrap overflow-ellipsis'>
        <span class='text-gray-300'>{props.data.content}</span>
      </div>
    </div>
  );
};
