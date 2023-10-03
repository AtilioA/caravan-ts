export function removeItemFromArray<T>(array: T[], item: T): T | null {
  const index = array.indexOf(item);
  if (index !== -1) {
      array.splice(index, 1);
      return item;
  }
  return null;
}
