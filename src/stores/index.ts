import {createStore} from 'solid-js/store';

const [connection, setConnection] = createStore({id: ''});

export const setConnectionId = (id: string): void => {
  setConnection({id});
};

export const getConnectionId = (): string => {
  return connection.id;
};
