import {JSX, JSXElement, mergeProps, splitProps} from 'solid-js';

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: JSXElement;
  variant?: 'primary' | 'secondary';
};

export const Button = (props: Props): JSXElement => {
  props = mergeProps({variant: 'secondary'}, props);
  const [ownProps, htmlProps] = splitProps(props, ['children', 'variant']);
  return (
    <button
      classList={{
        'bg-blue-600 hover:bg-blue-700': ownProps.variant === 'primary',
        'bg-zinc-600 hover:bg-zinc-700': ownProps.variant === 'secondary',
      }}
      class='transition-colors p-2 rounded-md flex justify-center items-center'
      {...htmlProps}
    >
      {ownProps.children}
    </button>
  );
};
