export function listKeyExtractor<T>(item: T, index: number): string {
  if (item && typeof item === "object" && "id" in item) {
    return String(item.id);
  }
  return `item-${index}`;
}
