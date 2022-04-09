import {createContext, JSXElement, Show, useContext} from 'solid-js';
import {createStore} from 'solid-js/store';
import {Button} from 'src/components/base/button';

type MenuContext = readonly [
  {
    dropdownVisible: boolean;
  },
  {
    setVisible: (value: boolean) => void;
  }
];

const MenuContext = createContext<MenuContext>([
  {dropdownVisible: false},
  {setVisible: () => undefined},
]);

type Props = {
  children: JSXElement;
};

export const Menu = (props: Props): JSXElement => {
  const [state, setState] = createStore({dropdownVisible: false});
  const store = [
    state,
    {
      setVisible(value: boolean) {
        setState('dropdownVisible', value);
      },
    },
  ] as const;
  return <MenuContext.Provider value={store}>{props.children}</MenuContext.Provider>;
};

export const MenuButton = (props): JSXElement => {
  const [state, {setVisible}] = useContext(MenuContext);
  return <Button onClick={() => setVisible(!state.dropdownVisible)}>{props.children}</Button>;
};

export const MenuList = (props): JSXElement => {
  const [state, {setVisible}] = useContext(MenuContext);
  return (
    <Show when={state.dropdownVisible}>
      <div>{props.children}</div>
    </Show>
  );
};
