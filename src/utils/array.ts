/**
 * Removes a specified item from an array.
 * @param array The array to remove the item from.
 * @param item The item to be removed.
 * @returns The removed item if found, otherwise null.
 */
export function removeItemFromArray<T>(array: T[], item: T): T | null {
  const index = array.indexOf(item);
  if (index !== -1) {
    array.splice(index, 1);
    return item;
  }
  return null;
}
