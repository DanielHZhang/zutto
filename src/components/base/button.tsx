import type {JSX, JSXElement} from 'solid-js';
import {mergeProps, splitProps} from 'solid-js';
import {css} from 'solid-styled-components';
import {mergeCss} from 'src/utils';

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: JSXElement;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export const Button = (props: ButtonProps): JSXElement => {
  props = mergeProps({variant: 'secondary'}, props);
  const [ownProps, htmlProps] = splitProps(props, ['children', 'variant', 'class', 'size']);

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
  /** @tw */
  const small = 'h-8';

  return (
    <button
      class={mergeCss(`${flex} ${base}`, ownProps.class)}
      classList={{
        [disabled]: htmlProps.disabled,
        [primary]: ownProps.variant === 'primary',
        [secondary]: ownProps.variant === 'secondary',
        [small]: ownProps.size === 'sm',
      }}
      {...htmlProps}
    >
      {ownProps.children}
    </button>
  );
};

type SplitButtonProps = Omit<ButtonProps, 'children'> & {
  left: JSXElement;
  right: JSXElement;
};

export const SplitButton = (props: SplitButtonProps): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['left', 'right']);
  const hoverCss = css({
    '&:hover': {
      '> .left': {
        backgroundColor: '#1a2950',
        transition: 'background-color 0.2s ease',
      },
    },
  });

  return (
    <Button class={`p-0 ${hoverCss}`} {...htmlProps}>
      <div class='left bg-slate-500 transition-colors flex items-center self-stretch px-2 rounded-bl-md rounded-tl-md'>
        {ownProps.left}
      </div>
      <div class='right bg-slate-600 transition-colors flex items-center self-stretch px-2 rounded-br-md rounded-tr-md'>
        {ownProps.right}
      </div>
    </Button>
  );
};
