import {JSXElement} from 'solid-js';

type Props = {
  children: JSXElement;
};

export const Button = (props: Props): JSXElement => {
  return <button class='bg-stone-700 px-2'>{props.children}</button>;
};
