import type {DeepReadonly, SetStoreFunction} from 'solid-js/store';
import {createStore} from 'solid-js/store';

type FormHook<V extends object> = {
  handleSubmit: (func: (values: DeepReadonly<V>) => any) => (event: SubmitEvent) => void;
  register: (key: keyof V) => {
    onInput: (event: InputEvent & {currentTarget: HTMLInputElement}) => void;
  };
  setValues: SetStoreFunction<V>;
};

type FormOptions<V> = {
  initialValues: V;
};

export function createForm<V extends Record<any, any>>(options: FormOptions<V>): FormHook<V> {
  const [formState, setFormState] = createStore(options.initialValues);

  return {
    handleSubmit: (onSubmit) => async (event) => {
      event.preventDefault();
      try {
        const result = await onSubmit(formState);
      } catch (error) {
        console.error(error);
      }
    },
    setValues: setFormState,
    register: (key) => ({
      onInput: (event) => {
        if (event.currentTarget) {
          let value: string | number = event.currentTarget.value;
          if (typeof options.initialValues[key] === 'number') {
            value = Number(value);
          }
          setFormState(key as any, value as any);
        }
      },
      value: formState[key],
    }),
  };
}
