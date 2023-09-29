import { Direction } from "../enums/directions";
import { Caravan } from "../models/Caravan";
import { Card } from "../models/Card";
import { generateCards, getRandomCardFace, getRandomCardNonFace } from "../utils/card";

describe('Caravan', () => {
  it('should pass', () => {});

    it('should initialize a caravan with a direction, suit, and value', () => {
        const caravan = new Caravan();
        expect(caravan.direction).toBeNull();
        expect(caravan.suit).toBeNull();
        expect(caravan.bid).toEqual(0);
    });

    it('should check if a card can be added to the caravan (empty, suit defined)', () => {
        const caravan = new Caravan([], Direction.ASCENDING, 'Clubs', 0);

        let isValid = caravan.canAddCard(new Card('2', 'Spades'));
        expect(isValid).toBe(true);

        isValid = caravan.canAddCard(new Card('2', 'Clubs'));
        expect(isValid).toBe(true);
    });

    it('should check if a card can be added to the caravan (differing suit)', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds')], Direction.ASCENDING, 'Diamonds', 0);

        let isValid = caravan.canAddCard(new Card('2', 'Clubs'));
        expect(isValid).toBe(false);

        isValid = caravan.canAddCard(new Card('10', 'Clubs'));
        expect(isValid).toBe(true);
    });

    it('should check if a card can be added to the caravan (same suit)', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds')], Direction.ASCENDING, 'Diamonds', 0);

        let isValid = caravan.canAddCard(new Card('2', 'Diamonds'));
        expect(isValid).toBe(true);

        isValid = caravan.canAddCard(new Card('10', 'Diamonds'));
        expect(isValid).toBe(true);
    });

    it('should allow any non face card to be added', () => {
        const caravan = new Caravan();
        const isValid = caravan.canAddCard(getRandomCardNonFace());
        expect(isValid).toBe(true);
    });

    it('should allow a face card to be added if the caravan is not empty', () => {
        const caravan = new Caravan([getRandomCardNonFace()]);
        const isValid = caravan.canAddCard(getRandomCardFace());
        expect(isValid).toBe(true);
    });

    it('should not allow a face card to be added if the caravan is empty', () => {
        const caravan = new Caravan();
        const isValid = caravan.canAddCard(getRandomCardFace());
        expect(isValid).toBe(false);
    });

    it('should be able to be disbanded, resetting the caravan and returning the cards', () => {
        const caravan = new Caravan(generateCards(10, false));
        const caravanCards = caravan.cards;

        const discarded = caravan.disband();

        expect(discarded).toEqual(caravanCards);
        expect(caravan.cards.length).toEqual(0);
        expect(caravan.direction).toBeNull();
        expect(caravan.suit).toBeNull();
        expect(caravan.bid).toEqual(0);
    });

    it('should set suit property to the suit of the first added card', () => {
        const caravan = new Caravan();
        const card = new Card('5', 'Diamonds');

        caravan.addCard(card);

        expect(caravan.suit).toEqual('Diamonds');
    });

    it('should change the suit property when adding cards of different suits', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds')], null, 'Diamonds', 5);
        caravan.addCard(new Card('6', 'Clubs'));

        expect(caravan.suit).toEqual('Clubs');
    });

    it('should set the direction property based on the values of the first two added cards', () => {
        const caravan = new Caravan();

        caravan.addCard(new Card('5', 'Diamonds'));
        caravan.addCard(new Card('7', 'Diamonds'));

        expect(caravan.direction).toEqual(Direction.ASCENDING);
    });

    it('should not change the direction when adding subsequent cards', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds'), new Card('7', 'Diamonds')], Direction.ASCENDING, 'Diamonds', 12);
        caravan.addCard(new Card('8', 'Diamonds'));

        expect(caravan.direction).toEqual(Direction.ASCENDING);
    });

    it('should correctly update the bid when adding non-face cards', () => {
        const caravan = new Caravan();
        caravan.addCard(new Card('5', 'Diamonds'));

        expect(caravan.bid).toEqual(5);

        caravan.addCard(new Card('7', 'Diamonds'));

        expect(caravan.bid).toEqual(12);
    });

    // Attaching cards should be handled by the game logic perhaps
    // it('should correctly update the bid when adding a King', () => {
    //     const caravan = new Caravan([new Card('5', 'Diamonds')]);
    //     caravan.addCard(new Card('King', 'Clubs')); // Assuming King doubles the last card value

    //     expect(caravan.bid).toEqual(10);
    // });

    // it('should correctly update the bid when adding a Jack', () => {
    //     const caravan = new Caravan([new Card('5', 'Diamonds'), new Card('7', 'Clubs')]);
    //     caravan.addCard(new Card('Jack', 'Hearts')); // Assuming Jack removes all the cards of the same suit

    //     expect(caravan.bid).toEqual(5); // 7 removed by Jack
    // });

    it('should correctly update the suit and direction when adding a Queen', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds'), new Card('7', 'Clubs')], Direction.ASCENDING, 'Clubs', 12);

        caravan.addCard(new Card('Queen', 'Hearts'));

        expect(caravan.suit).toEqual('Hearts');
        expect(caravan.direction).toBeNull();
    });
});
