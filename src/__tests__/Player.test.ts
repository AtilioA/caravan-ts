// TODO: modularize into smaller describe blocks, use beforeEach to create instances

import { InvalidPlayError } from "../exceptions/GameExceptions";
import { Caravan } from "../models/Caravan";
import { Card } from "../models/Card";
import { Deck } from "../models/Deck";
import { Player } from "../models/Player";
import { generateCards } from "../utils/card";

describe('Player', () => {
    it('should create a player with an empty set of cards', () => {
        const player = new Player();
        expect(player.cardSet.getSize()).toEqual(0);
    });

    it('should create a player with a set of cards', () => {
        const playerDeck = new Deck();
        playerDeck.generate(40);
        const player = new Player(playerDeck);
        expect(player.cardSet.getSize()).toEqual(40);
    });

    it('should create a player with an empty hand', () => {
        const player = new Player();
        expect(player.hand.length).toEqual(0);
    });

    it('should be able to draw a hand of n cards from the cardSet', () => {
        const deckSize = Math.floor(Math.random() * (60 - 40 + 1) + 40);
        const handSize = Math.floor(Math.random() * (10 - 5 + 1) + 5);

        const playerDeck = new Deck();
        playerDeck.generate(deckSize);

        const player = new Player(playerDeck);
        player.drawHand(handSize);

        expect(player.hand.length).toEqual(handSize);
        expect(player.cardSet.getSize()).toEqual(deckSize - handSize);
    });

    it('should discard a card from the hand', () => {
        const playerDeck = new Deck();
        playerDeck.generate(40);
        const player = new Player(playerDeck);

        player.drawHand(5);
        const discardedCard = player.hand[0];
        player.discardCard(discardedCard);

        expect(player.hand.length).toEqual(4);
        expect(player.hand).not.toContain(discardedCard);
    });

    it('should not draw a card if cardSet is empty', () => {
        const player = new Player();

        expect(() => player.drawCard()).toThrowError(InvalidPlayError);
        expect(player.hand.length).toEqual(0);
    });

    it('should play a valued card from hand to a caravan and not have it in hand anymore', () => {
        const playerValuedDeck = new Deck(generateCards(40, false));
        const player = new Player(playerValuedDeck);
        player.drawHand(5);

        const cardToPlay = player.hand[0];

        player.playCard(cardToPlay, player.caravans[0]);
        expect(player.hand).not.toContain(cardToPlay);
    });

    it('should not play a card not present in hand', () => {
        // Assuming there is an appropriate method or mechanism to check this in the player class
        const playerDeck = new Deck();
        playerDeck.generate(40);
        const player = new Player(playerDeck);
        const cardNotInHand = new Card('10', 'Diamonds');
        // TODO: add Caravan to the Player object
        const caravan = new Caravan();
        expect(() => player.playCard(cardNotInHand, caravan)).toThrowError(InvalidPlayError);
    });

    it('should be able to draw a card from the cardSet and add it to the player’s hand.', () => {
                const playerDeck = new Deck();
        playerDeck.generate(40);
        const player = new Player(playerDeck);
        player.drawCard();
        expect(player.hand.length).toEqual(1);
        expect(player.cardSet.getSize()).toEqual(39); // 40 - 1
    });

    it('should be able to determine an opponent’s caravan.', () => {
        //         const playerDeck = new Deck();
        // playerDeck.generate(40);
        // const player = new Player(playerDeck);
        // const opponent = new Player(playerDeck);
        // const caravan = new Caravan();
        // // Create or get an opponent's caravan object here.
        // expect(player.isOpponentCaravan(opponent)).toEqual(caravan); // assuming isOpponentCaravan returns the opponent's caravan
    });

    it('should be able to play a face card to an opponent’s caravan’s card.', () => {
        const player = new Player();
        const faceCard = new Card('King', 'Diamonds');
        player.hand.push(faceCard);

        const caravan = new Caravan();

        caravan.cards = generateCards(2, false);
        const enemyCard = caravan.cards[0];

        player.playCardToOpponentCaravan(faceCard, enemyCard);
        expect(enemyCard.attachedCards).toContain(faceCard);
        expect(player.hand).not.toContain(faceCard);
    });

    it('should not be able to play a card to the opponent’s caravan if it’s not a face card.', () => {
        const player = new Player();
        const notFaceCard = new Card('10', 'Diamonds');
        player.hand.push(notFaceCard);

        const opponent = new Player(new Deck(), [], [new Caravan(generateCards(4, false)), new Caravan(generateCards(4, false)), new Caravan(generateCards(4, false))]);

        expect(() => player.playCardToOpponentCaravan(notFaceCard, opponent.caravans[0].cards[0])).toThrowError(InvalidPlayError);
    });
    // REVIEW: Should not play a card to an invalid caravan?
});
