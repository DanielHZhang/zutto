import type {JSX, JSXElement} from 'solid-js';
import {splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: Props): JSXElement => {
  const [own, rest] = splitProps(props, ['class']);
  return (
    <input
      class={mergeCss(
        'input-focus rounded-md px-3 p-2 bg-slate-700 outline-none focus:shadow-focus',
        own.class
      )}
      {...rest}
    />
  );
};
