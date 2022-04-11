import type {JSXElement} from 'solid-js';
import {createContext, createEffect, Show, splitProps, useContext} from 'solid-js';
import type {SetStoreFunction} from 'solid-js/store';
import {createStore} from 'solid-js/store';
import {css} from 'solid-styled-components';
import type {ButtonProps} from 'src/components/base/button';
import {Button} from 'src/components/base/button';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {clickOutside} from 'src/directives';

type ContextState = {
  visible: boolean;
  x: number;
  y: number;
};

type MenuContext = readonly [
  ContextState,
  {
    setMenu: SetStoreFunction<ContextState>;
    onSelect?: (key: string) => void;
    onClose?: () => void;
  }
];

const MenuContext = createContext<MenuContext>([
  {visible: false, x: 0, y: 0},
  {
    setMenu: () => undefined,
  },
]);

type MenuProps = {
  children: JSXElement;
  onSelect?: (key: string) => void;
  onClose?: () => void;
  onVisiblityChange?: (visible: boolean) => void;
};

export const Menu = (props: MenuProps): JSXElement => {
  const [state, setState] = createStore<ContextState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const store = [
    state,
    {
      setMenu: setState,
      onSelect: props.onSelect,
      onClose: props.onClose,
    },
  ] as const;

  createEffect(() => {
    props.onVisiblityChange?.(state.visible);
  });

  return <MenuContext.Provider value={store}>{props.children}</MenuContext.Provider>;
};

type MenuButtonProps = ButtonProps & {
  onClick?: () => void;
};

export const MenuButton = (props: MenuButtonProps): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['onClick']);
  const [menu, {setMenu}] = useContext(MenuContext);
  return (
    <Button
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setMenu({
          visible: !menu.visible,
          x: event.currentTarget.offsetLeft,
          y: event.currentTarget.offsetTop + rect.height,
        });
        ownProps.onClick?.(event);
      }}
      {...htmlProps}
    >
      {props.children}
    </Button>
  );
};

type MenuListProps = {
  children: JSXElement;
};

export const MenuList = (props: MenuListProps): JSXElement => {
  const [menu, {setMenu, onClose}] = useContext(MenuContext);

  return (
    <Show when={menu.visible}>
      <div
        use:clickOutside={(event) => {
          event.stopPropagation();
          setMenu('visible', false);
          onClose?.();
        }}
        class='min-w-max absolute z-20'
        style={{left: `${menu.x}px`, top: `${menu.y}px`}}
      >
        <section class='bg-popover p-2 rounded-lg shadow-xl'>{props.children}</section>
      </div>
    </Show>
  );
};

type MenuItemProps = {
  key: string;
  children: JSXElement;
};

export const MenuItem = (props: MenuItemProps): JSXElement => {
  const [, {setMenu, onSelect}] = useContext(MenuContext);
  const styledCss = css({
    justifyContent: 'start',
  });

  return (
    <Button
      variant='ghost'
      class={`${styledCss} min-w-50 hover:bg-hover`}
      onClick={() => {
        onSelect?.(props.key);
        setMenu('visible', false);
      }}
    >
      <span>{props.children}</span>
    </Button>
  );
};
