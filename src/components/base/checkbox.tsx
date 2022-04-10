import CheckIcon from 'iconoir/icons/check.svg';
import type {JSXElement} from 'solid-js';
import {createSignal, Show} from 'solid-js';

type Props = {
  defaultChecked?: boolean;
};

export const Checkbox = (props: Props): JSXElement => {
  const [checked, setChecked] = createSignal(props.defaultChecked || false);
  let inputCheckbox: HTMLInputElement;

  /** @tw */
  const checkedClass = 'bg-blue-600';

  return (
    <label class='flex w-4 h-4 bg-slate-300 rounded-sm shadow-checkbox'>
      <input
        ref={(element) => (inputCheckbox = element)}
        class='appearance-none whitespace-nowrap absolute overflow-hidden'
        type='checkbox'
        style={{width: '1px', height: '1px', padding: 0, margin: 0, border: 'none'}}
      />
      <span
        class='cursor-pointer rounded-sm shadow-checkbox'
        classList={{
          [checkedClass]: checked(),
        }}
        onClick={() => {
          inputCheckbox.click();
          setChecked(!checked());
        }}
      >
        <div class='flex items-center justify-center w-4 h-4'>
          <Show when={checked()}>
            <CheckIcon width='16px' height='16px' />
          </Show>
        </div>
      </span>
    </label>
  );
};
