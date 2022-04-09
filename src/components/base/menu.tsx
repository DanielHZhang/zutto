import {createContext, JSXElement, Show, splitProps, useContext} from 'solid-js';
import {createStore, SetStoreFunction} from 'solid-js/store';
import {css} from 'solid-styled-components';
import {Button, ButtonProps} from 'src/components/base/button';

type ContextState = {
  visible: boolean;
  x: number;
  y: number;
  onSelect?: (key: string) => void;
  // selectedKey: string;
};

type MenuContext = readonly [ContextState, SetStoreFunction<ContextState>];

const MenuContext = createContext<MenuContext>([{visible: false, x: 0, y: 0}, () => null]);

type MenuProps = {
  children: JSXElement;
  onSelect?: (key: string) => void;
};

export const Menu = (props: MenuProps): JSXElement => {
  const [state, setState] = createStore<ContextState>({
    visible: false,
    x: 0,
    y: 0,
    onSelect: props.onSelect,
    // selectedKey: '',
  });

  // createEffect(() => {
  //   console.log('when is effect run');
  //   props.onSelect?.(state.selectedKey);
  // });

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

export const MenuList = (props): JSXElement => {
  const [menu] = useContext(MenuContext);

  return (
    <Show when={menu.visible}>
      <div class='min-w-max absolute z-20 ' style={{left: `${menu.x}px`, top: `${menu.y}px`}}>
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
