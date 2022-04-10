import type {JSX, JSXElement} from 'solid-js';
import {mergeProps, splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: JSXElement;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export const Button = (props: ButtonProps): JSXElement => {
  props = mergeProps({variant: 'secondary'}, props);
  const [ownProps, htmlProps] = splitProps(props, ['children', 'variant', 'class']);

  /** @tw */
  const flex = 'flex justify-center items-center p-2 rounded-md';
  /** @tw */
  const base = 'transition-colors focus:shadow-focus outline-none';
  /** @tw */
  const primary = 'bg-blue-600' + (props.disabled ? '' : ' hover:bg-blue-700');
  /** @tw */
  const secondary = 'bg-zinc-600' + (props.disabled ? '' : ' hover:bg-zinc-700');
  /** @tw */
  const disabled = 'opacity-40 cursor-not-allowed';

  return (
    <button
      class={mergeCss(`${flex} ${base}`, ownProps.class)}
      classList={{
        [primary]: ownProps.variant === 'primary',
        [secondary]: ownProps.variant === 'secondary',
        [disabled]: htmlProps.disabled,
      }}
      {...htmlProps}
    >
      {ownProps.children}
    </button>
  );
};
