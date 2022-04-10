import type {JSXElement} from 'solid-js';
import {Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {Button} from 'src/components/base/button';

type Props = {
  isOpen: boolean;
  children: JSXElement;
  onClose: () => any;
};

const modalRoot = document.getElementById('modals')!;

export const Modal = (props: Props): JSXElement => {
  return (
    <Show when={props.isOpen}>
      <Portal mount={modalRoot}>
        <div class='fixed left-0 top-0 w-screen h-screen bg-stone-800 bg-opacity-50' />
        <div class='fixed left-0 top-0 w-screen h-screen overflow-auto flex items-center justify-center z-10'>
          <section class=' relative bg-slate-800 text-gray-100 rounded-lg w-120 max-h-150 shadow-md'>
            <Button class='absolute w-8 right-0' onClick={props.onClose}>
              x
            </Button>
            <div class='p-4'>{props.children}</div>
          </section>
        </div>
      </Portal>
    </Show>
  );
};
