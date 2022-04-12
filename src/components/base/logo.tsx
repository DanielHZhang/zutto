import type {LinkProps} from 'solid-app-router';
import {Link} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {splitProps} from 'solid-js';
import CubeIcon from 'src/components/icons/3d-select-face.svg';
import {mergeCss} from 'src/utils';

type Props = Omit<LinkProps, 'href'> & {
  href?: string;
};

export const Logo = (props: Props): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['class', 'href']);

  /** @tw */
  const css = 'flex items-center';

  return (
    <Link href={ownProps.href || '/'} class={mergeCss(css, ownProps.class)} {...htmlProps}>
      <CubeIcon />
    </Link>
  );
};
