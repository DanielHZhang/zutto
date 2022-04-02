import {JSXElement} from 'solid-js';

type Props = {
  children: JSXElement;
};

export const Button = (props: Props): JSXElement => {
  return <button class='bg-slate-700 p-2 rounded-md'>{props.children}</button>;
};
