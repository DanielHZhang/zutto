export function toExplorer(tableName: string): string {
  return `/explorer/${encodeURIComponent(tableName)}`;
}
