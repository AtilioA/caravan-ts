import { removeItemFromArray } from "../utils/array";
import { generateCards } from "../utils/card";

describe('test utilitary functions', () => {
  it('removeItemFromArray should remove an existing item from an array and return it', () => {
      let array = [1, 2, 3];
      let item = array[2];
      let removedItem = removeItemFromArray(array, item);

      expect(array).toEqual([1, 2]);
      expect(removedItem).toEqual(3);
  })

  it('removeItemFromArray should return null if the item is not in the array', () => {
      let array = [1, 2, 3];
      let item = 4;
      let removedItem = removeItemFromArray(array, item);

      expect(array).toEqual([1, 2, 3]);
      expect(removedItem).toBeNull();
  });

  it('generateCards should generate a number of cards (not including face cards)', () => {
      const cards = generateCards(10);
      expect(cards.length).toEqual(10);
  });

  it('generateCards should generate a number of cards (including face cards)', () => {
      const cards = generateCards(10, true);
      expect(cards.length).toEqual(10);
  });

  it('generateCards should work with default parameters', () => {
      const cards = generateCards();
      expect(cards.length).toEqual(52);
  });
});
