import type {Component} from 'solid-js';
import {createContext} from 'solid-js';
import type {SetStoreFunction} from 'solid-js/store';
import {createStore} from 'solid-js/store';

type ContextState = {
  id: string;
};

type RootContext = [ContextState, SetStoreFunction<ContextState>];

export const RootContext = createContext<RootContext>([{id: ''}, () => undefined]);

export const RootProvider: Component = (props) => {
  const store = createStore<ContextState>({id: ''});
  return <RootContext.Provider value={store}>{props.children}</RootContext.Provider>;
};
