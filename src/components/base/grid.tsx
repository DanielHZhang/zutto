import {Accessor, For, JSXElement} from 'solid-js';

type Props<T> = {
  items: T[];
  children: (item: T, index: Accessor<number>) => JSXElement;
};

export const Grid = <T,>(props: Props<T>): JSXElement => {
  return (
    <div class='flex flex-wrap'>
      <For each={props.items}>{props.children}</For>
    </div>
  );
};
