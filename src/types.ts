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

export type RenamePayload = {
  originalName: string;
  newName: string;
};

export type TableOverview = {
  name: string;
  numRecords: number;
  numColumns: number;
};
