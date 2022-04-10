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
