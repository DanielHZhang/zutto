import type {Component} from 'solid-js';
import {createContext} from 'solid-js';
import type {SetStoreFunction} from 'solid-js/store';
import {createStore} from 'solid-js/store';

type ContextState = {
  connection: {
    id: string;
  };
};

type RootContext = [ContextState, SetStoreFunction<ContextState>];

export const GlobalContext = createContext<RootContext>([{connection: {id: ''}}, () => undefined]);

export const GlobalProvider: Component = (props) => {
  const store = createStore<ContextState>({connection: {id: ''}});
  return <GlobalContext.Provider value={store}>{props.children}</GlobalContext.Provider>;
};
