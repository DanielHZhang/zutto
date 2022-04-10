import type {JSX} from 'solid-js';
import {onCleanup} from 'solid-js';

export function clickOutside(
  elemtn: HTMLElement,
  accessor: () => JSX.Directives['clickOutside']
): void {
  const onClick = (event: MouseEvent) => {
    if (!elemtn.contains(event.target as Node)) {
      accessor()?.(event);
    }
  };
  document.body.addEventListener('click', onClick);

  onCleanup(() => {
    document.body.removeEventListener('click', onClick);
  });
}
