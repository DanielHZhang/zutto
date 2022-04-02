import {JSXElement, Show} from 'solid-js';
import {Portal} from 'solid-js/web';

type Props = {
  isOpen: boolean;
};

export const Modal = (props: Props): JSXElement => {
  return (
    <Show when={props.isOpen}>
      <Portal mount={document.getElementById('modals')}>
        <div>Modal</div>
      </Portal>
    </Show>
  );
};
