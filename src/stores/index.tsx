import type {Component} from 'solid-js';
import {createContext} from 'solid-js';
import type {SetStoreFunction} from 'solid-js/store';
import {createStore} from 'solid-js/store';
import type {Table} from 'src/types';

type ContextState = {
  connection: {
    id: string;
  };
  tables: Record<string, Table>;
};

type RootContext = [ContextState, SetStoreFunction<ContextState>];

const defaultValue: ContextState = {
  connection: {id: ''},
  tables: {},
};

export const RootContext = createContext<RootContext>([defaultValue, () => undefined]);

export const RootProvider: Component = (props) => {
  const store = createStore<ContextState>(defaultValue);
  return <RootContext.Provider value={store as any}>{props.children}</RootContext.Provider>;
};
