export function mergeCss(baseClass: string, ownClass?: string): string {
  return ownClass ? `${baseClass} ${ownClass}` : baseClass;
}
