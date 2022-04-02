import {JSXElement, Show} from 'solid-js';
import {Portal} from 'solid-js/web';
import {Button} from 'src/components/base/button';

type Props = {
  isOpen: boolean;
  children: JSXElement;
  onClose: () => any;
};

const modalRoot = document.getElementById('modals');

export const Modal = (props: Props): JSXElement => {
  return (
    <Show when={props.isOpen}>
      <Portal mount={modalRoot}>
        <div class='fixed top-5 left-5 text-gray-100 bg-slate-800 p-4 rounded-lg min-w-100 min-h-100'>
          <Button onClick={props.onClose}>x</Button>
          <div>{props.children}</div>
        </div>
      </Portal>
    </Show>
  );
};
