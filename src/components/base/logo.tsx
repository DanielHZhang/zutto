import type {LinkProps} from 'solid-app-router';
import {Link} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {splitProps} from 'solid-js';
import CubeIcon from 'src/components/icons/3d-select-face.svg';
import {mergeCss} from 'src/utils';

export const Logo = (props: Omit<LinkProps, 'href'>): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['class']);

  /** @tw */
  const css = 'flex items-center';

  return (
    <Link {...htmlProps} href='/' class={mergeCss(css, ownProps.class)}>
      <CubeIcon />
    </Link>
  );
};
