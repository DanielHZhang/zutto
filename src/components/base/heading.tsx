import {JSX, JSXElement, splitProps} from 'solid-js';
import {mergeCss} from 'src/utils';

type HeadingProps = JSX.HTMLAttributes<HTMLHeadingElement>;

export const Heading = (props: HeadingProps): JSXElement => {
  const [own, rest] = splitProps(props, ['class']);
  return (
    <h1 class={mergeCss('text-3xl font-bold', own.class)} {...rest}>
      {props.children}
    </h1>
  );
};

export const Subheading = (props: HeadingProps): JSXElement => {
  const [own, rest] = splitProps(props, ['class']);
  return (
    <h2 class={mergeCss('text-xl font-medium', own.class)} {...rest}>
      {props.children}
    </h2>
  );
};
