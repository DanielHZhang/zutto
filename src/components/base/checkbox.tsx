import CheckIcon from 'iconoir/icons/check.svg';
import MinusIcon from 'iconoir/icons/minus.svg';
import type {JSXElement} from 'solid-js';
import {createEffect, createSignal, Match, Switch} from 'solid-js';

export enum CheckboxState {
  Unchecked,
  Checked,
  Partial,
}

export type CheckboxProps = {
  defaultChecked?: CheckboxState;
  checked?: CheckboxState;
  onCheck?: (checked: CheckboxState) => void;
};

export const Checkbox = (props: CheckboxProps): JSXElement => {
  const [checked, setChecked] = createSignal<CheckboxState>(
    props.defaultChecked || CheckboxState.Unchecked
  );
  let inputCheckbox: HTMLInputElement;

  createEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked);
    }
  });

  /** @tw */
  const checkedClass = 'bg-blue-400';

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
          [checkedClass]: checked() !== CheckboxState.Unchecked,
        }}
        onClick={(event) => {
          event.preventDefault();
          inputCheckbox.click();
          const result = setChecked((prev) => {
            if (prev === CheckboxState.Checked) {
              return CheckboxState.Unchecked;
            }
            return CheckboxState.Checked;
          });
          props.onCheck?.(result);
        }}
      >
        <div class='flex items-center justify-center w-4 h-4'>
          <Switch>
            <Match when={checked() === CheckboxState.Checked}>
              <CheckIcon width='16px' height='16px' color='#000' />
            </Match>
            <Match when={checked() === CheckboxState.Partial}>
              <MinusIcon width='16px' height='16px' color='#000' />
            </Match>
          </Switch>
        </div>
      </span>
    </label>
  );
};
