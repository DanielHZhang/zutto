import {JSX, JSXElement} from 'solid-js';

type Props = JSX.InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: Props): JSXElement => {
  return <input class='rounded-md p-2 bg-slate-500 outline-none' {...props} />;
};
