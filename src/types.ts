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

export type CellData = {
  id: number;
  content: string;
};

export type TableData = {
  headers: string[];
  data: CellData[][];
};

// type RowModification = {
//   deleted?: boolean;
//   changes: Record<
//     number, // Key is column number
//     {
//       originalValue: string;
//       newValue?: string;
//     }
//   >;
// };

type Modificiation = {
  deleted?: boolean;
  originalValue: string;
  newValue?: string;
};

// export type ModificationPayload = {
//   columns: Record<string, Modificiation>;
//   rows: Record<number, RowModification>; // Key is row number
// };

export type ModificationsMap = Record<`${number},${number}`, Modificiation>;
