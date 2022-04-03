import {createSignal, JSX} from 'solid-js';
import {createStore} from 'solid-js/store';

type FormHook = {
  handleSubmit: (func: () => any) => (event: SubmitEvent) => void;
  register: (key: string) => {
    onInput: (event: InputEvent & {currentTarget: HTMLInputElement}) => void;
  };
};

export function createForm(): FormHook {
  const [formState, setFormState] = createStore<Record<string, any>>({});
  // const [formState, setFormState] = createSignal({
  //   values: {},
  // });

  const handleSubmit = (func: () => any) => (event: SubmitEvent) => {
    event.preventDefault();
    //
    console.log(event);
  };

  return {
    handleSubmit,
    register: (key: string) => ({
      onInput: (event) => {
        if (event.currentTarget) {
          setFormState(key, event.currentTarget.value);
        }
        console.log(formState);
        // console.log(event.currentTarget.value)
      },
    }),
  };
}
