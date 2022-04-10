import type {JSXElement} from 'solid-js';
import {createContext, Show, splitProps, useContext} from 'solid-js';
import type {SetStoreFunction} from 'solid-js/store';
import {createStore} from 'solid-js/store';
import {css} from 'solid-styled-components';
import type {ButtonProps} from 'src/components/base/button';
import {Button} from 'src/components/base/button';
import {clickOutside} from 'src/directives';

type ContextState = {
  visible: boolean;
  x: number;
  y: number;
  onSelect?: (key: string) => void;
};

type MenuContext = readonly [ContextState, SetStoreFunction<ContextState>];

const MenuContext = createContext<MenuContext>([{visible: false, x: 0, y: 0}, () => null]);

type MenuProps = {
  children: JSXElement;
  onSelect?: (key: string) => void;
  onClose?: () => void;
};

export const Menu = (props: MenuProps): JSXElement => {
  const [state, setState] = createStore<ContextState>({
    visible: false,
    x: 0,
    y: 0,
    onSelect: props.onSelect,
  });

  return <MenuContext.Provider value={[state, setState]}>{props.children}</MenuContext.Provider>;
};

type MenuButtonProps = ButtonProps & {
  onClick?: () => void;
};

export const MenuButton = (props: MenuButtonProps): JSXElement => {
  const [ownProps, htmlProps] = splitProps(props, ['onClick']);
  const [menu, setMenu] = useContext(MenuContext);
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
  const [menu, setMenu] = useContext(MenuContext);

  // const onBodyClick = () => {
  //   setMenu('visible', false);
  //   // props.onClose?.();
  //   console.log('body clicked');
  // };

  // window.addEventListener('click', onBodyClick);

  // onCleanup(() => {
  //   window.removeEventListener('click', onBodyClick);
  // });

  return (
    <Show when={menu.visible}>
      <div
        use:clickOutside={() => setMenu('visible', false)}
        // use:clickOutside={() => {
        //   setMenu('visible', false);
        //   console.log('setting');
        // }}
        class='min-w-max absolute z-20 '
        style={{left: `${menu.x}px`, top: `${menu.y}px`}}
      >
        <section class='bg-zinc-400 p-2 rounded-lg shadow-xl'>{props.children}</section>
      </div>
    </Show>
  );
};

type MenuItemProps = {
  key: string;
  children: JSXElement;
};

export const MenuItem = (props: MenuItemProps): JSXElement => {
  const [menu, setMenu] = useContext(MenuContext);
  const styledCss = css({
    justifyContent: 'start',
  });

  return (
    <Button
      class={`min-w-50 ${styledCss}`}
      onClick={() => {
        menu.onSelect?.(props.key);
        setMenu('visible', false);
      }}
    >
      <span>{props.children}</span>
    </Button>
  );
};
