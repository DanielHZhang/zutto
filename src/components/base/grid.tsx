import type {Accessor, JSXElement} from 'solid-js';
import {For, Show} from 'solid-js';

type Props<T> = {
  items: T[];
  children: (item: T, index: Accessor<number>) => JSXElement;
  fallback?: JSXElement;
};

export const Grid = <T,>(props: Props<T>): JSXElement => {
  return (
    <div class='grid grid-cols-3 gap-4 place-content-stretch'>
      <Show when={props.items.length > 0} fallback={props.fallback}>
        <For each={props.items}>{props.children}</For>
      </Show>
    </div>
  );
};
