import {JSX, JSXElement, mergeProps, splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: JSXElement;
  variant?: 'primary' | 'secondary';
};

export const Button = (props: ButtonProps): JSXElement => {
  props = mergeProps({variant: 'secondary'}, props);
  const [ownProps, htmlProps] = splitProps(props, ['children', 'variant', 'class']);

  /** @tw */
  const base = 'transition-colors p-2 rounded-md flex justify-center items-center';
  return (
    <button
      class={mergeCss(base, ownProps.class)}
      classList={{
        'bg-blue-600 hover:bg-blue-700': ownProps.variant === 'primary',
        'bg-zinc-600 hover:bg-zinc-700': ownProps.variant === 'secondary',
      }}
      {...htmlProps}
    >
      {ownProps.children}
    </button>
  );
};
