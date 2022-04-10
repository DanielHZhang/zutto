import {onCleanup} from 'solid-js';

export function clickOutside(el: HTMLElement, accessor: () => any): void {
  const onClick = (e: any) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener('click', onClick);

  onCleanup(() => {
    console.log('running cleanup');
    document.body.removeEventListener('click', onClick);
  });
}
