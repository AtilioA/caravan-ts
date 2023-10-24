// TODO: modularize into smaller describe blocks, use beforeEach to create instances

import { InvalidPlayError } from "../exceptions/GameExceptions";
import { Caravan } from "../models/Caravan";
import { Card } from "../models/Card";
import { Deck } from "../models/Deck";
import { Player } from "../models/Player";
import { generateCards } from "../utils/card";
import { createMockCaravan, createMockCard, createMockPlayer } from "./__mocks__/mockFactories";

describe("Player", () => {
  it("should create a player with an empty set of cards.", () => {
    const player = new Player();
    expect(player.cardSet.getSize()).toEqual(0);
  });

  it("should create a player with an empty discard pile.", () => {
    const player = new Player();
    expect(player.discardPile.getSize()).toEqual(0);
  });

  it("should create a player with a set of cards.", () => {
    const playerDeck = new Deck();
    playerDeck.generate(40);
    const player = new Player(playerDeck);
    expect(player.cardSet.getSize()).toEqual(40);
  });

  it("should create a player with an empty hand.", () => {
    const player = new Player();
    expect(player.hand.length).toEqual(0);
  });

  it("should be able to draw a hand of n cards from the cardSet.", () => {
    const deckSize = Math.floor(Math.random() * (60 - 40 + 1) + 40);
    const handSize = Math.floor(Math.random() * (10 - 5 + 1) + 5);

    const playerDeck = new Deck();
    playerDeck.generate(deckSize);

    const player = new Player(playerDeck);
    player.drawHand(handSize);

    expect(player.hand.length).toEqual(handSize);
    expect(player.cardSet.getSize()).toEqual(deckSize - handSize);
  });

  it("should be able to discard a card from the hand.", () => {
    const playerDeck = new Deck();
    playerDeck.generate(40);
    const player = new Player(playerDeck);
    expect(player.discardPile.getSize()).toEqual(0);

    player.drawHand(5);
    const discardedCard = player.hand[0];
    player.discardCard(discardedCard);

    expect(player.hand.length).toEqual(4);
    expect(player.hand).not.toContain(discardedCard);
    expect(player.discardPile.getSize()).toEqual(1);
    expect(player.discardPile.cards).toContain(discardedCard);
  });

  it("should not draw a card if cardSet is empty.", () => {
    const player = new Player();

    expect(() => player.drawCard()).toThrowError(InvalidPlayError);
    expect(player.hand.length).toEqual(0);
  });

  it("should be able to draw a card if hand is empty but cardSet is not.", () => {
    const playerDeck = new Deck();
    playerDeck.generate(40);
    const player = new Player(playerDeck);

    expect(player.hand.length).toEqual(0);
    expect(player.cardSet.getSize()).toEqual(40);

    player.drawCard();

    expect(player.hand.length).toEqual(1);
    expect(player.cardSet.getSize()).toEqual(39);
  });

  it("should play a valued card from hand to a caravan and not have it in hand anymore.", () => {
    const playerValuedDeck = new Deck(generateCards(40, false));
    const player = new Player(playerValuedDeck);
    player.drawHand(5);

    const cardToPlay = player.hand[0];

    player.playCard(cardToPlay, player.caravans[0]);
    expect(player.hand).not.toContain(cardToPlay);
  });

  it("should not play a card not present in hand.", () => {
    // Assuming there is an appropriate method or mechanism to check this in the player class
    const playerDeck = new Deck();
    playerDeck.generate(40);
    const player = new Player(playerDeck);
    const cardNotInHand = new Card("10", "Diamonds");

    // For this test, it doesn't actually matter if the caravan is from the player or opponent
    player.caravans[0] = new Caravan();
    expect(() => player.playCard(cardNotInHand, player.caravans[0])).toThrowError(InvalidPlayError);
  });

  it("should be able to draw a card from the cardSet and add it to the player’s hand.", () => {
    const playerDeck = new Deck();
    playerDeck.generate(40);

    const player = new Player(playerDeck);
    player.drawCard();

    expect(player.hand.length).toEqual(1);
    expect(player.cardSet.getSize()).toEqual(39); // 40 - 1
  });

  it("should be able to determine an opponent’s caravan.", () => {
    const player = new Player();

    const opponent = new Player();
    const caravan = new Caravan();
    opponent.caravans[0] = caravan;

    expect(player.isNotOwnCaravan(caravan)).toBe(true);
  });

  it("should be able to play a face card to an opponent’s caravan’s card.", () => {
    const player = new Player();
    const faceCard = new Card("King", "Diamonds");
    player.hand.push(faceCard);

    const caravan = new Caravan();

    caravan.cards = generateCards(2, false);
    const enemyCard = caravan.cards[0];

    player.playCardToOpponentCaravan(faceCard, enemyCard);
    expect(enemyCard.attachedCards).toContain(faceCard);
    expect(player.hand).not.toContain(faceCard);
  });

  it("should not be able to play a card to the opponent’s caravan if it’s not a face card (playCard).", () => {
    const player = new Player();
    const notFaceCard = new Card("10", "Diamonds");
    player.hand.push(notFaceCard);

    const opponent = new Player(new Deck(), [], [new Caravan(generateCards(4, false)), new Caravan(generateCards(4, false)), new Caravan(generateCards(4, false))]);

    expect(() => player.playCard(notFaceCard, opponent.caravans[0])).toThrowError(InvalidPlayError);
  });

  it("should not be able to play a card to the opponent’s caravan if it’s not a face card (playCardToOpponentCaravan).", () => {
    const player = new Player();
    const notFaceCard = new Card("10", "Diamonds");
    player.hand.push(notFaceCard);

    const opponent = new Player(new Deck(), [], [new Caravan(generateCards(4, false)), new Caravan(generateCards(4, false)), new Caravan(generateCards(4, false))]);

    expect(() => player.playCardToOpponentCaravan(notFaceCard, opponent.caravans[0].cards[0])).toThrowError(InvalidPlayError);
  });

  it("should be able to attach a face card to a card in the player’s caravan.", () => {
    const player = new Player();
    const faceCard = new Card("King", "Diamonds");
    player.hand.push(faceCard);

    player.caravans[0] = new Caravan();
    player.caravans[0].cards = generateCards(2, false);
    const targetCard = player.caravans[0].cards[0];

    player.attachFaceCard(faceCard, targetCard);
    expect(targetCard.attachedCards).toContain(faceCard);
    expect(player.hand).not.toContain(faceCard);
  });

  it("should be able to attach a face card to a card in the player’s caravan.", () => {
    const player = new Player();
    const faceCard = new Card("King", "Diamonds");
    player.hand.push(faceCard);

    player.caravans[0] = new Caravan();
    player.caravans[0].cards = generateCards(2, false);
    const targetCard = player.caravans[0].cards[0];

    player.attachFaceCard(faceCard, targetCard);
    expect(targetCard.attachedCards).toContain(faceCard);
    expect(player.hand).not.toContain(faceCard);
  });

  it("should not be able to attach a face card not in the player's hand to a card.", () => {
    const player = new Player();
    const faceCard = new Card("King", "Diamonds");

    player.caravans[0] = new Caravan();
    player.caravans[0].cards = generateCards(2, false);
    const targetCard = player.caravans[0].cards[0];

    expect(() => player.attachFaceCard(faceCard, targetCard)).toThrowError(InvalidPlayError);
    expect(targetCard.attachedCards).not.toContain(faceCard);
    expect(player.hand).not.toContain(faceCard);
  });

  it("should not allow attaching a Queen to a card in the player’s caravan.", () => {
    const player = new Player();
    const queen = new Card("Queen", "Diamonds");
    player.hand.push(queen);

    player.caravans[0] = new Caravan();
    player.caravans[0].cards = generateCards(2, false);
    const targetCard = player.caravans[0].cards[0];

    expect(() => player.attachFaceCard(queen, targetCard)).toThrowError(InvalidPlayError);
    expect(targetCard.attachedCards).not.toContain(queen);
    expect(player.hand).toContain(queen);
  });

  it("should not allow disbanding a caravan that is not from the player.", () => {
    const player = createMockPlayer();
    const opponent = createMockPlayer();

    expect(player.isNotOwnCaravan(opponent.caravans[0])).toBe(true);
    expect(() => player.disbandCaravan(opponent.caravans[0])).toThrowError(InvalidPlayError);
  });

  it("should not allow disbanding an empty caravan.", () => {
    const player = createMockPlayer();

    expect(player.caravans[0].cards.length).toEqual(0);
    expect(() => player.disbandCaravan(player.caravans[0])).toThrowError(InvalidPlayError);
  });

  it("should be able to get only valued cards from the player’s hand.", () => {
    const player = createMockPlayer();
    const valuedCards = player.getValuedCards();

    // Iterate over the 'value' attribute of valuedCards and check for isFaceCard
    valuedCards.forEach(card => {
      expect(card.isFaceCard()).toBe(false);
    });
  });

  it("should be able to find a caravan by a card (card is in a caravan).", () => {
    const player = createMockPlayer();
    const valuedCard = createMockCard("10", "Diamonds");
    player.hand.push(valuedCard);
    player.caravans[0].addCard(valuedCard);

    expect(player.getCaravanByCard(valuedCard)).toEqual(player.caravans[0]);
  });

  it("should be return null when looking for a caravan by a card (card is not in any caravan).", () => {
    const player = createMockPlayer();
    const card = new Card("10", "Diamonds");

    expect(player.getCaravanByCard(card)).toBeNull();
  });

  it("should be able to generate an array of possible actions for discarding all cards in hand.", () => {
    const player = createMockPlayer();
    player.drawHand(8);

    const possibleActions = player.generatePossibleMoves(false);

    // Caravans are empty and the player has 8 cards, so they can at least discard 8 cards
    // (this disregards the game rule for having at least 3 valued cards)
    expect(possibleActions.length).toBeGreaterThan(7);
  });

  it("should be able to generate an array of possible actions for playing all cards in all caravans after the opening rounds.", () => {
    const player = createMockPlayer();
    player.hand = generateCards(8, false);

    const possibleActions = player.generatePossibleMoves(false);

    // Caravans are empty and the player has 8 cards, so they can at least discard 8 cards
    // Also, they can play all cards in hand to any caravans
    expect(possibleActions.length).toBeGreaterThanOrEqual(8 * 3 + 8);

    // The possibleActions array should have an action for each card in hand for each caravan
    for (const caravan of player.caravans) {
      for (const card of player.hand) {
        expect(possibleActions).toContainEqual({
          player,
          action: {
            type: "PLAY_CARD",
            card,
            target: caravan
          }
        });
      }
    }
  });

  it("should be able to generate an array of possible actions for taking any actions in any caravan after the opening rounds.", () => {
    const player = createMockPlayer();
    player.hand = generateCards(8, true);

    // 'Initialize' caravans with cards
    player.caravans = [createMockCaravan(), createMockCaravan(), createMockCaravan()];
    player.caravans[0].addCard(new Card("10", "Diamonds"));
    player.caravans[0].addCard(new Card("7", "Diamonds"));
    player.caravans[1].addCard(new Card("Ace", "Spades"));
    player.caravans[1].addCard(new Card("4", "Hearts"));

    const possibleActions = player.generatePossibleMoves(false);

    // Player has 8 cards, so they can at least discard 8 cards
    const discardableCards = player.hand.length;
    // Also, they can play cards in hand to caravans, and disband caravans
    const playableCards = player.hand.filter(card => player.caravans.some(caravan => caravan.canAddCard(card))).length;
    const disbandableCaravans = player.caravans.filter(caravan => player.canDisbandCaravan(caravan)).length;

    expect(possibleActions.length).toBeGreaterThanOrEqual(discardableCards + disbandableCaravans + playableCards);

    // Now, check for the actual actions
    // The possibleActions array should have an action for each card in hand for each caravan
    for (const caravan of player.caravans) {
      for (const card of player.hand) {
        if (caravan.canAddCard(card) && !card.isFaceCard()) {
          expect(possibleActions).toContainEqual({
            player,
            action: {
              type: "PLAY_CARD",
              card,
              target: caravan
            }
          });
        }

        // Should have an action for attaching each face card in hand to each valued card in each caravan
        for (const caravanCard of caravan.cards) {
          if (caravanCard.canAttachFaceCard(card)) {
            expect(possibleActions).toContainEqual({
              player,
              action: {
                type: "PLAY_CARD",
                card,
                target: caravanCard
              }
            });
          }
        }
      }
      // Should have an action for disbanding each caravan, if possible
      if (player.canDisbandCaravan(caravan)) {
        expect(possibleActions).toContainEqual({
          player,
          action: {
            type: "DISBAND_CARAVAN",
            caravan
          }
        });
      }
    }

    // Finally, should have an action for discarding each card in hand (any card can be discarded)
    for (const card of player.hand) {
      expect(possibleActions).toContainEqual({
        player,
        action: {
          type: "DISCARD_DRAW",
          card,
        }
      });
    }
  });

  it("should be able to generate an array of possible actions for taking any actions in any caravan at the start of the opening rounds.", () => {
    const player = createMockPlayer();
    player.hand = generateCards(8, true);

    // Initialize Player's caravans
    player.caravans = [createMockCaravan(), createMockCaravan(), createMockCaravan()];

    // Generate possible Player actions given that it's an opening round
    const possibleActions = player.generatePossibleMoves(true);

    // Player has 8 cards, but can't discard any cards during the opening rounds
    const discardableCards = 0;
    // Caravans can't be disbanded during the opening rounds
    const disbandableCaravans = 0;
    // Player can play cards in hand to caravans
    const playableCards = player.hand.filter(card => player.caravans.some(caravan => caravan.canAddCard(card))).length;

    // 0 + 0 + number of valued cards
    expect(possibleActions.length).toBeGreaterThanOrEqual(discardableCards + disbandableCaravans + playableCards);

    // Now, check for the actual actions
    // The possibleActions array should have an action for each card in hand for each caravan
    for (const caravan of player.caravans) {
      for (const card of player.hand) {
        if (caravan.canAddCard(card) && !card.isFaceCard()) {
          expect(possibleActions).toContainEqual({
            player,
            action: {
              type: "PLAY_CARD",
              card,
              target: caravan
            }
          });
        }

        // Should NOT have an action for attaching each face card in hand to each valued card in each caravan
        for (const caravanCard of caravan.cards) {
          if (caravanCard.canAttachFaceCard(card)) {
            expect(possibleActions).not.toContainEqual({
              player,
              action: {
                type: "PLAY_CARD",
                card,
                target: caravanCard
              }
            });
          }
        }
        // Should NOT have an action for disbanding any caravan
        if (player.canDisbandCaravan(caravan)) {
          expect(possibleActions).not.toContainEqual({
            player,
            action: {
              type: "DISBAND_CARAVAN",
              caravan
            }
          });
        }

        // Finally, should NOT have an action for discarding each card in hand (any card can be discarded)
        for (const card of player.hand) {
          expect(possibleActions).not.toContainEqual({
            player,
            action: {
              type: "DISCARD_DRAW",
              card,
            }
          });
        }
      }
    }
  });

  it("should be able to generate an array of possible actions for taking any actions in any caravan during the opening rounds.", () => {
    const player = createMockPlayer();
    player.hand = generateCards(8, true);

    // Initialize Player's caravans
    player.caravans = [createMockCaravan(), createMockCaravan(), createMockCaravan()];
    player.caravans[1].addCard(createMockCard("Ace", "Spades"));
    player.caravans[0].addCard(createMockCard("10", "Diamonds"));

    // Generate possible Player actions given that it's an opening round
    const possibleActions = player.generatePossibleMoves(true);

    // Player has 8 cards, but can't discard any cards during the opening rounds
    const discardableCards = 0;
    // Caravans can't be disbanded during the opening rounds
    const disbandableCaravans = 0;
    // Player can play cards in hand to caravans
    const playableCards = player.hand.filter(card => player.caravans.some(caravan => caravan.isEmpty() && caravan.canAddCard(card))).length;

    // 0 + 0 + number of valued cards
    expect(possibleActions.length).toBeGreaterThanOrEqual(discardableCards + disbandableCaravans + playableCards);

    // Now, check for the actual actions
    // The possibleActions array should have an action for each card in hand for each caravan
    for (const caravan of player.caravans) {
      for (const card of player.hand) {
        if (caravan.isEmpty() && caravan.canAddCard(card) && !card.isFaceCard()) {
          expect(possibleActions).toContainEqual({
            player,
            action: {
              type: "PLAY_CARD",
              card,
              target: caravan
            }
          });
        }

        // Should NOT have an action for attaching each face card in hand to each valued card in each caravan
        for (const caravanCard of caravan.cards) {
          if (caravanCard.canAttachFaceCard(card)) {
            expect(possibleActions).not.toContainEqual({
              player,
              action: {
                type: "PLAY_CARD",
                card,
                target: caravanCard
              }
            });
          }
        }
        // Should NOT have an action for disbanding any caravan
        if (player.canDisbandCaravan(caravan)) {
          expect(possibleActions).not.toContainEqual({
            player,
            action: {
              type: "DISBAND_CARAVAN",
              caravan
            }
          });
        }

        // Finally, should NOT have an action for discarding each card in hand (any card can be discarded)
        for (const card of player.hand) {
          expect(possibleActions).not.toContainEqual({
            player,
            action: {
              type: "DISCARD_DRAW",
              card,
            }
          });
        }
      }
    }
  });
});
