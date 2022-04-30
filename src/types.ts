export type ConnectionConfig = {
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  databaseName: string;
};

export type PublicConnectionConfig = {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  databaseName: string;
};

export type RenameTablePayload = {
  originalName: string;
  newName: string;
};

export type DeleteTablePayload = {
  tableName: string;
  cascade: boolean;
};

export type CreateTablePayload = {
  name: string;
  primaryKey: string;
  autoIncrement?: boolean;
  columns: {name: string; type: string}[];
  associations?: any[];
};

export type TableOverview = {
  name: string;
  numRecords: number;
  numColumns: number;
};

export type QueryDataPayload = {
  tableName: string;
  offset: number;
};

export type Modificiation = {
  deleted?: boolean;
  originalValue: string;
  newValue?: string;
};

export type Modifications = Record<`${number},${number}`, Modificiation>;

export type TableData = {
  headers: string[];
  data: string[][];
};

export type Table = TableData & {
  modifications: Modifications;
};
