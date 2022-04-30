import type {Component, JSX} from 'solid-js';
import {splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

type Props = JSX.HTMLAttributes<HTMLDivElement>;

export const Cell: Component<Props> = (props) => {
  const [ownProps, htmlProps] = splitProps(props, ['class']);

  /** @tw */
  const baseClass =
    'flex items-center flex-shrink-0 w-52 h-10 min-w-0 border-l-2 border-b-2 border-slate-700 last:border-r-2 select-none relative';

  return (
    <div class={mergeCss(baseClass, ownProps.class)} {...htmlProps}>
      {props.children}
    </div>
  );
};
