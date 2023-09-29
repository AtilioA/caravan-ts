import { EnumSuits } from "../enums/cards";
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
        const caravan = new Caravan([], Direction.ASCENDING, EnumSuits.CLUBS, 0);

        let isValid = caravan.canAddCard(new Card('2', 'Spades'));
        expect(isValid).toBe(true);

        isValid = caravan.canAddCard(new Card('2', 'Clubs'));
        expect(isValid).toBe(true);
    });

    it('should check if a card can be added to the caravan (differing suit)', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds')], Direction.ASCENDING, EnumSuits.DIAMONDS, 0);

        let isValid = caravan.canAddCard(new Card('2', 'Clubs'));
        expect(isValid).toBe(false);

        isValid = caravan.canAddCard(new Card('10', 'Clubs'));
        expect(isValid).toBe(true);
    });

    it('should check if a card can be added to the caravan (same suit)', () => {
        const caravan = new Caravan([new Card('5', 'Diamonds')], Direction.ASCENDING, EnumSuits.DIAMONDS, 0);

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
        const card = new Card('5', EnumSuits.DIAMONDS);

        caravan.addCard(card);

        expect(caravan.suit).toEqual(EnumSuits.DIAMONDS);
    });

    it('should change the suit property when adding cards of different suits', () => {
        const caravan = new Caravan([new Card('5', EnumSuits.DIAMONDS)], null, EnumSuits.DIAMONDS, 5);
        caravan.addCard(new Card('6', EnumSuits.CLUBS));

        expect(caravan.suit).toEqual(EnumSuits.CLUBS);
    });

    it('should set the direction property based on the values of the first two added cards', () => {
        const caravan = new Caravan();

        caravan.addCard(new Card('5', EnumSuits.DIAMONDS));
        caravan.addCard(new Card('7', EnumSuits.DIAMONDS));

        expect(caravan.direction).toEqual(Direction.ASCENDING);
    });

    it('should not change the direction when adding subsequent cards', () => {
        const caravan = new Caravan([new Card('5', EnumSuits.DIAMONDS), new Card('7', EnumSuits.DIAMONDS)], Direction.ASCENDING, EnumSuits.DIAMONDS, 12);
        caravan.addCard(new Card('8', EnumSuits.DIAMONDS));

        expect(caravan.direction).toEqual(Direction.ASCENDING);
    });

    it('should correctly update the bid when adding non-face cards', () => {
        const caravan = new Caravan();
        caravan.addCard(new Card('5', EnumSuits.DIAMONDS));

        expect(caravan.bid).toEqual(5);

        caravan.addCard(new Card('7', EnumSuits.DIAMONDS));

        expect(caravan.bid).toEqual(12);
    });

    // Attaching cards should be handled by the game logic perhaps
    // it('should correctly update the bid when adding a King', () => {
    //     const caravan = new Caravan([new Card('5', EnumSuits.DIAMONDS)]);
    //     caravan.addCard(new Card('King', EnumSuits.CLUBS)); // Assuming King doubles the last card value

    //     expect(caravan.bid).toEqual(10);
    // });

    // it('should correctly update the bid when adding a Jack', () => {
    //     const caravan = new Caravan([new Card('5', EnumSuits.DIAMONDS), new Card('7', EnumSuits.CLUBS)]);
    //     caravan.addCard(new Card('Jack', EnumSuits.HEARTS)); // Assuming Jack removes all the cards of the same suit

    //     expect(caravan.bid).toEqual(5); // 7 removed by Jack
    // });

    it('should correctly update the suit and direction when adding a Queen', () => {
        const caravan = new Caravan([new Card('5', EnumSuits.DIAMONDS), new Card('7', EnumSuits.CLUBS)], Direction.ASCENDING, EnumSuits.CLUBS, 12);

        caravan.addCard(new Card('Queen', EnumSuits.HEARTS));

        expect(caravan.suit).toEqual(EnumSuits.HEARTS);
        expect(caravan.direction).toBeNull();
    });
});
