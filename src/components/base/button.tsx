import {JSX, JSXElement, splitProps} from 'solid-js';

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: JSXElement;
};

export const Button = (props: Props): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['children']);
  return (
    <button class='bg-slate-700 p-2 rounded-md' {...htmlProps}>
      {ownProps.children}
    </button>
  );
};
