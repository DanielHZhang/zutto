import type {JSX, JSXElement} from 'solid-js';
import {splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

type HeadingProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export const Heading = (props: HeadingProps): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['class']);
  return (
    <h1 class={mergeCss('text-3xl font-bold', ownProps.class)} {...htmlProps}>
      {props.children}
    </h1>
  );
};

export const Subheading = (props: HeadingProps): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['class']);
  return (
    <h2 class={mergeCss('text-xl font-medium', ownProps.class)} {...htmlProps}>
      {props.children}
    </h2>
  );
};
