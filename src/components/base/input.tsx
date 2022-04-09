import {JSX, JSXElement, splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: Props): JSXElement => {
  const [own, rest] = splitProps(props, ['class']);
  return (
    <input
      class={mergeCss(
        'input-focus rounded-md px-3 p-1 bg-slate-700 outline-none focus:border-blue-400',
        own.class
      )}
      {...rest}
    />
  );
};
