import CancelIcon from 'iconoir/icons/cancel.svg';
import type {JSXElement} from 'solid-js';
import {createEffect, mergeProps, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {Button} from 'src/components/base/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {clickOutside} from 'src/directives';

type Props = {
  isOpen: boolean;
  children: JSXElement;
  onClose: () => any;
  trapFocus?: boolean;
};

const modalRoot = document.getElementById('modals')!;

export const Modal = (props: Props): JSXElement => {
  props = mergeProps({trapFocus: true}, props);

  let closeButton: HTMLButtonElement;
  createEffect(() => {
    if (props.isOpen && props.trapFocus) {
      closeButton.focus();
    }
  });

  /** @tw */
  const wholeScreen = 'fixed left-0 top-0 w-screen h-screen';

  return (
    <Show when={props.isOpen}>
      <Portal mount={modalRoot}>
        <div class={`${wholeScreen} bg-stone-800 bg-opacity-50`} />
        <div
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              props.onClose();
            }
          }}
          class={`${wholeScreen} outline-none overflow-auto flex items-center justify-center z-10`}
        >
          <section
            use:clickOutside={() => props.onClose()}
            class='relative bg-slate-800 text-gray-100 rounded-lg w-120 max-h-150 shadow-md'
          >
            <Button
              ref={(element) => (closeButton = element)}
              variant='ghost'
              class='absolute right-2 top-2'
              onClick={props.onClose}
            >
              <CancelIcon />
            </Button>
            <div class='p-8'>{props.children}</div>
          </section>
        </div>
      </Portal>
    </Show>
  );
};
