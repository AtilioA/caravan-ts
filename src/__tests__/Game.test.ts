import { Direction } from "../enums/directions";
import { InvalidGameState, InvalidPlayError } from "../exceptions/GameExceptions";
import { EasyStrategy } from "../models/AI/EasyStrategy";
import { Deck } from "../models/Deck";
import { Game } from "../models/Game";
import { IPlayer } from "../models/interfaces/IPlayer";
import { generateCards } from "../utils/card";
import { createMockCard, createMockPlayer } from "./__mocks__/mockFactories";

const setCaravanBids = (player: IPlayer, bids: number[]) => {
  player.caravans.forEach((caravan, index) => caravan.bid = bids[index]);
};

// describe('Game - unit tests', () => {
//   let game: Game;
//   let player1: IPlayer;
//   let player2: IPlayer;

//   beforeEach(() => {
//     player1 = createMockPlayer();
//     player2 = createMockPlayer();

//     game = new Game([player1, player2]);
//     game.start();
//     // Skip opening rounds
//     game.isOpeningRound = false;
//   });
// });

describe("Game - Initialization", () => {
  it("should initialize the game with the correct initial state.", () => {
    const game = new Game();
    expect(game.players.length).toEqual(0);
  });

  it("should not start a game with less than two players.", () => {
    const game = new Game();

    expect(game.players.length).toEqual(0);
    expect(() => game.start()).toThrowError(InvalidGameState);
    expect(game.players.length).toEqual(0);
  });

  it("should not start the game with more than two players.", () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer(), createMockPlayer()];
    const game = new Game(mockPlayers);

    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it("should not start a game with a player with less than 30 cards.", () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()];
    mockPlayers[0].cardSet = new Deck(generateCards(29));

    const game = new Game(mockPlayers);
    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it("should not start a game with a player with more than 216 cards.", () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()];
    mockPlayers[0].cardSet = new Deck(generateCards(217));

    const game = new Game(mockPlayers);
    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it("should be able to start the game, dealing 8 cards to each player.", () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()];
    const game = new Game(mockPlayers);
    game.start();

    expect(mockPlayers[0].hand.length).toEqual(8);
    expect(mockPlayers[1].hand.length).toEqual(8);
  });

  it("should be able to start the game, dealing 8 cards to each player; these cards must come from their decks.", () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()];
    const game = new Game(mockPlayers);

    const player1DeckSize = mockPlayers[0].cardSet.getSize();
    const player2DeckSize = mockPlayers[1].cardSet.getSize();

    game.start();

    // Deck has 8 less cards now.
    expect(mockPlayers[0].cardSet.getSize()).toEqual(player1DeckSize - 8);
    expect(mockPlayers[1].cardSet.getSize()).toEqual(player2DeckSize - 8);

    // NOTE: Won't test if the cards are the same because of randomness, and because the underlying functions are tested elsewhere.
  });
});

describe("Game - Playing turns", () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
    // Skip opening rounds
    game.isOpeningRound = false;
  });

  it("should allow a player to play a valued card on their caravan.", () => {
    const valuedCard = createMockCard("2", "Diamonds");
    player1.hand.push(valuedCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player1.caravans[0]
      }
    });

    expect(player1.caravans[0].cards).toContain(valuedCard);
    expect(player1.hand).not.toContain(valuedCard);
  });

  it("should not allow a player to play/attach a valued card to a card.", () => {
    player1.caravans[0].addCard(createMockCard("2", "Diamonds"));

    const valuedCard = createMockCard("3", "Diamonds");
    player1.hand.push(valuedCard);

    expect(() => {
      game.playTurn({
        player: player1,
        action: {
          type: "PLAY_CARD",
          card: valuedCard,
          target: player1.caravans[0].cards[0]
        }
      });
    }).toThrowError(InvalidPlayError);

    expect(player1.caravans[0].cards).not.toContain(valuedCard);
    expect(player1.hand).toContain(valuedCard);
  });

  it("should not allow a player to play/attach a Queen to a card.", () => {
    player1.caravans[0].addCard(createMockCard("2", "Diamonds"));

    const queenCard = createMockCard("Queen", "Diamonds");
    player1.hand.push(queenCard);

    expect(() => {
      game.playTurn({
        player: player1,
        action: {
          type: "PLAY_CARD",
          card: queenCard,
          target: player1.caravans[0].cards[0]
        }
      });
    }).toThrowError(InvalidPlayError);

    expect(player1.caravans[0].cards).not.toContain(queenCard);
    expect(player1.hand).toContain(queenCard);
  });

  it("should change the current player after a turn is played.", () => {
    expect(game.currentPlayerIndex).toEqual(0);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: player1.hand[0],
        target: player1.caravans[0]
      }
    });

    expect(game.currentPlayerIndex).toEqual(1);
  });

  it("should allow a player to play a valued card on their caravan and draw another one.", () => {
    const valuedCard = createMockCard("2", "Diamonds");
    player1.hand.push(valuedCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player1.caravans[0]
      }
    });

    expect(player1.caravans[0].cards).toContain(valuedCard);
    expect(player1.hand).not.toContain(valuedCard);
    expect(player1.hand.length).toEqual(9); // 9 because we pushed 1 beyond the initial 8
  });

  it("should update the caravan's bid after a player plays a valued card on their caravan.", () => {
    const valuedCard = createMockCard("2", "Diamonds");
    player1.hand.push(valuedCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player1.caravans[0]
      }
    });

    expect(player1.caravans[0].bid).toEqual(2);
  });

  it("should allow a player to play/attach a face card on their cards.", () => {
    const faceCard = createMockCard("King", "Diamonds");
    const valuedCard = createMockCard("5", "Diamonds");

    player1.hand.push(faceCard);
    player1.caravans[0].addCard(valuedCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: faceCard,
        target: valuedCard
      }
    });

    expect(valuedCard.attachedCards).toContain(faceCard);
    expect(player1.hand).not.toContain(faceCard);
  });

  it("should update the caravan's bid after a player plays a face card on their cards.", () => {
    const faceCard = createMockCard("King", "Diamonds");
    const valuedCard = createMockCard("7", "Diamonds");

    player1.hand.push(faceCard);
    player1.caravans[0].addCard(valuedCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: faceCard,
        target: valuedCard
      }
    });

    expect(player1.caravans[0].bid).toEqual(14);
  });

  it("should allow a player to play a face card on their opponent’s cards.", () => {
    const faceCard = createMockCard("King", "Hearts");
    const valuedCard = createMockCard("7", "Hearts");

    player1.hand.push(faceCard);
    player2.caravans[1].cards.push(valuedCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: faceCard,
        target: valuedCard
      }
    });

    expect(valuedCard.attachedCards).toContain(faceCard);
    expect(player1.hand).not.toContain(faceCard);
  });

  it("should not allow a player to play a valued card on their opponent’s caravan.", () => {
    const valuedCard = createMockCard("8", "Clubs");

    player1.hand.push(valuedCard);

    expect(() => {
      game.playTurn({
        player: player1,
        action: {
          type: "PLAY_CARD",
          card: valuedCard,
          target: player2.caravans[0]
        }
      });
    }).toThrowError(InvalidPlayError);

    expect(player1.caravans[1].cards).not.toContain(valuedCard);
    expect(player1.hand).toContain(valuedCard);
  });

  it("should determine the winner correctly based on the game's rules.", () => {
    player1.caravans[0].cards = [createMockCard("10", "Diamonds"), createMockCard("8", "Diamonds"), createMockCard("2", "Diamonds")];
    player1.caravans[1].cards = [createMockCard("10", "Diamonds"), createMockCard("9", "Diamonds"), createMockCard("2", "Diamonds")];
    player1.caravans[2].cards = [];

    player2.caravans[0].cards = [createMockCard("10", "Diamonds"), createMockCard("8", "Diamonds"), createMockCard("2", "Diamonds")];
    player2.caravans[1].cards = [createMockCard("10", "Diamonds"), createMockCard("8", "Diamonds"), createMockCard("2", "Diamonds")];
    player2.caravans[2].cards = [createMockCard("10", "Diamonds"), createMockCard("8", "Diamonds"), createMockCard("2", "Diamonds")];

    player1.hand[0] = createMockCard("Ace", "Hearts");

    // Play final turns, then check the winner.
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: player1.hand[0],
        target: player1.caravans[0]
      }
    });

    expect(game.checkForWinner()).toBe(player1);
  });

  it("should not allow playing a card if it’s not the player’s turn.", () => {
    // Assuming it's player1's turn now.
    const valuedCard = createMockCard("3", "Hearts");
    player2.hand.push(valuedCard);

    expect(() => game.playTurn({
      player: player2,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player2.caravans[0]
      }
    })).toThrowError(InvalidPlayError);
  });

  it("should not allow a player to discard and draw a card if it's not their turn.", () => {
    // Assuming it's player1's turn now.
    const valuedCard = createMockCard("3", "Hearts");
    player2.hand.push(valuedCard);

    expect(() => game.playTurn({
      player: player2,
      action: {
        type: "DISCARD_DRAW",
        card: valuedCard
      }
    })).toThrowError(InvalidPlayError);
  });

  it("should allow a player to discard and draw a card if it's their turn.", () => {
    // Assuming it's player1's turn now.
    const valuedCard = createMockCard("3", "Hearts");
    player1.hand.push(valuedCard);
    const deckSize = player1.cardSet.getSize();

    game.playTurn({
      player: player1,
      action: {
        type: "DISCARD_DRAW",
        card: valuedCard
      }
    });

    // Card was discarded and moved to the discard pile.
    expect(player1.hand).not.toContain(valuedCard);
    expect(player1.discardPile.cards.length).toEqual(1);
    expect(player1.discardPile.cards).toContain(valuedCard);

    // New card was drawn from the player deck.
    expect(player1.hand.length).toEqual(9); // We pushed 1 beyond the initial 8
    expect(player1.cardSet.getSize()).toEqual(deckSize - 1); // We removed 1 from the deck

  });

  it("should not allow a player to discard a card if it's not in their hand.", () => {
    // Assuming it's player1's turn now.
    const valuedCard = createMockCard("3", "Hearts");
    const deckSize = player1.cardSet.getSize();

    expect(() => game.playTurn({
      player: player1,
      action: {
        type: "DISCARD_DRAW",
        card: valuedCard
      }
    })).toThrowError(InvalidPlayError);

    // Card was not discarded, not moved to the discard pile, and the player's hand and deck were not modified.
    expect(player1.hand).not.toContain(valuedCard);
    expect(player1.discardPile.cards.length).toEqual(0);
    expect(player1.discardPile.cards).not.toContain(valuedCard);

    // New card was not drawn from the player deck.
    expect(player1.hand.length).toEqual(8);
    expect(player1.cardSet.getSize()).toEqual(deckSize);
  });

  it("should not allow a player to disband a caravan if it's not their turn.", () => {
    // Assuming it's player1's turn now.
    const valuedCard = createMockCard("3", "Hearts");
    player2.hand.push(valuedCard);

    expect(() => game.playTurn({
      player: player2,
      action: {
        type: "DISBAND_CARAVAN",
        caravan: player2.caravans[0]
      }
    })).toThrowError(InvalidPlayError);
  });

  it("should allow a player to disband one of their caravans if it has any cards.", () => {
    const caravan = player1.caravans[0];
    caravan.addCard(createMockCard("5", "Diamonds"));

    game.playTurn({
      player: player1,
      action: {
        type: "DISBAND_CARAVAN",
        caravan: caravan
      }
    });

    expect(caravan.cards.length).toEqual(0);
    expect(caravan.bid).toEqual(0);
  });

  it("should not allow a player to disband one of their caravans if it has no cards.", () => {
    const caravan = player1.caravans[0];

    expect(() => game.playTurn({
      player: player1,
      action: {
        type: "DISBAND_CARAVAN",
        caravan: caravan
      }
    })).toThrowError(InvalidPlayError);
  });

  it("should add cards to the player's discard pile after a caravan is disbanded.", () => {
    const caravan = player1.caravans[0];
    caravan.addCard(createMockCard("5", "Diamonds"));
    caravan.addCard(createMockCard("6", "Diamonds"));

    game.playTurn({
      player: player1,
      action: {
        type: "DISBAND_CARAVAN",
        caravan: caravan
      }
    });

    expect(player1.discardPile.cards.length).toEqual(2);
  });

  it("should handle the end of the game correctly, allowing no more moves after the game ends.", () => {
    // Mock the game to be at an end state.
    game.end();

    const valuedCard = createMockCard("3", "Hearts");
    player1.hand.push(valuedCard);

    expect(() => game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player1.caravans[0]
      }
    })).toThrowError(InvalidPlayError);
  });

  it("should consider a caravan as sold only between a bid of 21-26.", () => {
    const caravan = player1.caravans[0];
    player1.hand = [createMockCard("10", "Diamonds"), createMockCard("9", "Diamonds"), createMockCard("7", "Diamonds")];

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: player1.hand[0],
        target: caravan
      }
    });
    // Bid is 10
    expect(caravan.isSold()).toBe(false);

    game.currentPlayerIndex = 0;
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: player1.hand[0],
        target: caravan
      }
    });
    // Bid is 19
    expect(caravan.isSold()).toBe(false);

    game.currentPlayerIndex = 0;
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: player1.hand[0],
        target: caravan
      }
    });
    // Bid is 26, caravan is sold
    expect(caravan.isSold()).toBe(true);
  });

  it("should be able to play a King on a valued card and have it double the card's value.", () => {
    const kingCard = createMockCard("King", "Diamonds");
    // Get a valued card from the player's hand
    const valuedCard = player1.getValuedCards()[0];

    player1.hand.push(kingCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player1.caravans[0]
      }
    });
    game.currentPlayerIndex = 0;
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: kingCard,
        target: valuedCard
      }
    });

    expect(valuedCard.attachedCards).toContain(kingCard);
    expect(player1.hand).not.toContain(kingCard);
    expect(player1.caravans[0].bid).toEqual(valuedCard.getNumericValue() * 2);
  });

  // NOTE: it is not possible to double the caravan's bid coincidentally because no two cards of the same value can be played on the same caravan.
  it("should be able to play a King on a valued card and not double the caravan's bid.", () => {
    const kingCard = createMockCard("King", "Diamonds");
    player1.hand.push(kingCard);

    // Get only valued cards from the player's hand
    const valuedCards = player1.getValuedCards();
    // Sort valued cards by value so that we can play in ascending order
    valuedCards.sort((a, b) => a.getNumericValue() - b.getNumericValue());
    // Remove duplicate valued cards (getNumericValue() cannot be the same for any given card)
    const uniqueValuedCards = valuedCards.filter((card, index, self) => index === self.findIndex((t) => t.getNumericValue() === card.getNumericValue()));

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: uniqueValuedCards[0],
        target: player1.caravans[0]
      }
    });
    game.currentPlayerIndex = 0;
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: uniqueValuedCards[1],
        target: player1.caravans[0]
      }
    });

    const caravanBidWithoutKing = player1.caravans[0].bid;

    game.currentPlayerIndex = 0;
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: kingCard,
        target: uniqueValuedCards[1]
      }
    });

    expect(uniqueValuedCards[1].attachedCards).toContain(kingCard);
    expect(player1.hand).not.toContain(kingCard);
    expect(player1.caravans[0].bid).toEqual(uniqueValuedCards[0].getNumericValue() + uniqueValuedCards[1].getNumericValue() * 2);
    expect(player1.caravans[0].bid).not.toEqual(caravanBidWithoutKing * 2);
  });
});


describe("Game - Playing Joker", () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
    // Skip opening rounds
    game.isOpeningRound = false;
  });

  it("should handle special cards (like Joker) and their effects on a non-ace card.", () => {
    const jokerCard = createMockCard("Joker", "Diamonds");
    player1.hand.push(jokerCard);

    player1.caravans[0].addCard(createMockCard("7", "Diamonds"));

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: jokerCard, target: player1.caravans[0].cards[0]}});

    // Validate effects of Joker here
  });

  it("should handle special cards (like Joker) and their effects on a ace card.", () => {
    const jokerCard = createMockCard("Joker", "Diamonds");
    player1.hand.push(jokerCard);

    const aceSpadesCard = createMockCard("Ace", "Spades");
    const sixSpadesCard = createMockCard("6", "Spades");
    const sevenDiamondsCard = createMockCard("7", "Diamonds");
    const eightHeartsCard = createMockCard("8", "Hearts");
    const nineSpadesCard = createMockCard("9", "Spades");
    player1.caravans[0].addCard(aceSpadesCard);
    player1.caravans[0].addCard(sixSpadesCard);
    player1.caravans[0].addCard(sevenDiamondsCard);

    // Should stay in the caravan
    player1.caravans[1].addCard(eightHeartsCard);

    // Should be removed from the caravan
    player1.caravans[2].addCard(nineSpadesCard);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: jokerCard, target: aceSpadesCard}});

    // Ace should remain, joker should be attached to it, six of spades should be discarded, six of diamonds should remain, bid should be 7
    expect(player1.caravans[0].cards).toContain(aceSpadesCard);
    expect(aceSpadesCard.attachedCards).toContain(jokerCard);
    expect(player1.caravans[0].cards).not.toContain(sixSpadesCard);
    expect(player1.caravans[0].cards).toHaveLength(2);
    expect(player1.caravans[0].cards).toContain(sevenDiamondsCard);
    expect(player1.caravans[0].bid).toEqual(8);

    expect(player1.caravans[1].cards).toContain(eightHeartsCard);
    expect(player1.caravans[1].bid).toEqual(8);

    expect(player1.caravans[2].cards).not.toContain(nineSpadesCard);
    expect(player1.caravans[2].bid).toEqual(0);

    expect(player1.discardPile.cards).toContain(sixSpadesCard);
    expect(player1.discardPile.cards).toContain(nineSpadesCard);
  });

  it("should not allow playing a Joker on a face card.", () => {
    const joker = createMockCard("Joker", "Diamonds");
    const king = createMockCard("King", "Diamonds");
    const card7 = createMockCard("7", "Diamonds");

    player1.hand.push(joker);
    player1.caravans[0].addCard(card7);
    player1.caravans[0].cards[0].attachFaceCard(king);

    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: joker, target: king}})).toThrowError(InvalidPlayError);
  });

  it("should only remove cards with the same value when Joker is played on a non-ace card.", () => {
    const jokerCard = createMockCard("Joker", "Diamonds");
    player1.hand.push(jokerCard);

    const sevenDiamondsCard = createMockCard("7", "Diamonds");
    const sevenSpadesCard = createMockCard("7", "Spades");
    const eightDiamondsCard = createMockCard("8", "Diamonds");

    player1.caravans[0].addCard(sevenDiamondsCard);
    player1.caravans[0].addCard(eightDiamondsCard);
    // Will get removed with the Joker
    player1.caravans[1].addCard(sevenSpadesCard);

    expect(player1.caravans[0].cards).toContain(sevenDiamondsCard);
    expect(player1.caravans[0].cards).toContain(eightDiamondsCard);
    expect(player1.caravans[1].cards).toContain(sevenSpadesCard);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: jokerCard, target: sevenDiamondsCard}});

    // Both cards should remain, joker should be attached to seven of diamonds, bid should be 15
    expect(player1.caravans[0].cards[0].attachedCards).toContain(jokerCard);
    expect(player1.caravans[0].cards).toContain(sevenDiamondsCard);
    expect(player1.caravans[0].cards).toContain(eightDiamondsCard);
    expect(player1.caravans[1].cards).not.toContain(sevenSpadesCard);

    // 15 because no cards were removed
    expect(player1.caravans[0].bid).toEqual(15);
    // 0 because the seven of spades was removed
    expect(player1.caravans[1].bid).toEqual(0);

    // Player 1's discard pile should contain only the seven of spades
    expect(player1.discardPile.cards.length).toEqual(1);
    expect(player1.discardPile.cards).toContain(sevenSpadesCard);
  });
});

describe("Game - Playing Jacks", () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
    // Skip opening rounds
    game.isOpeningRound = false;
  });

  it("should remove both the targeted number card and any attached face cards when playing a Jack", () => {
    const jackCard = createMockCard("Jack", "Diamonds");
    const kingCard = createMockCard("King", "Diamonds");

    const caravan = player1.caravans[0];
    const sevenDiamondsCard = createMockCard("7", "Diamonds");
    const sixDiamondsCard = createMockCard("6", "Diamonds");
    caravan.addCard(sevenDiamondsCard);
    caravan.cards[0].attachFaceCard(kingCard);
    caravan.addCard(sixDiamondsCard);

    player1.hand.push(jackCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: jackCard,
        target: sevenDiamondsCard
      }
    });

    // 7 and King should be in Player 1's discard pile; 6 should remain in the caravan
    expect(caravan.cards).not.toContain(sevenDiamondsCard);
    expect(caravan.cards).not.toContain(kingCard);

    expect(player1.discardPile.cards.length).toEqual(3);
    expect(player1.discardPile.cards).toContain(jackCard);
    expect(player1.discardPile.cards).toContain(sevenDiamondsCard);
    expect(player1.discardPile.cards).toContain(kingCard);

    expect(caravan.cards.length).toEqual(1);
    expect(caravan.bid).toEqual(6);

    // Make sure the 6 does not receive the King
    expect(caravan.cards[0].getNumericValue()).toEqual(6);
    expect(caravan.cards[0].attachedCards).not.toContain(kingCard);

    expect(player1.hand.length).toEqual(9); // New card is drawn

    // NOTE: testing if the cards were actually dettached is not important given that the cards are not used anymore.
    // This could be enhanced if we had a use for the discard pile.
  });

  it("should maintain the caravan's direction if Jack removes a card, if it leaves two identical number cards", () => {
    // Set up caravan with possibility of Jack removing a card and leaving two identical number cards.
    const caravan = player2.caravans[0];
    caravan.addCard(createMockCard("6", "Diamonds"));
    caravan.addCard(createMockCard("7", "Spades"));
    caravan.addCard(createMockCard("Queen", "Diamonds"));
    caravan.addCard(createMockCard("6", "Hearts"));

    const jackCard = createMockCard("Jack", "Diamonds");
    player1.hand.push(jackCard);
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: jackCard,
        target: caravan.cards[1]
      }
    });

    expect(caravan.cards.length).toEqual(3);
    expect(caravan.direction).toEqual(Direction.DESCENDING);
  });

  it("should change the caravan's direction if Jack removes a card, not leaving two identical number cards", () => {
    // Set up caravan with possibility of Jack removing a card and changing the direction.
    const caravan = player2.caravans[0];
    caravan.addCard(createMockCard("2", "Diamonds"));
    caravan.addCard(createMockCard("6", "Hearts"));
    caravan.addCard(createMockCard("4", "Hearts"));

    const jackCard = createMockCard("Jack", "Diamonds");
    player1.hand.push(jackCard);
    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: jackCard,
        target: caravan.cards[1]
      }
    });

    expect(caravan.cards.length).toEqual(2);
    expect(caravan.direction).toEqual(Direction.ASCENDING);
  });

  // it("should add cards to the player's discard pile after a Jack is played (opponent)", () => {
  //   const jackCard = createMockCard("Jack", "Diamonds");
  //   const kingCard = createMockCard("King", "Diamonds");

  //   const caravan = player2.caravans[0];
  //   caravan.addCard(createMockCard("5", "Diamonds"));
  //   caravan.cards[0].attachFaceCard(kingCard);
  //   caravan.addCard(createMockCard("6", "Diamonds"));

  //   player1.hand.push(jackCard);

  //   game.playTurn({
  //     player: player1,
  //     action: {
  //       type: "PLAY_CARD",
  //       card: jackCard,
  //       target: caravan.cards[0]
  //     }
  //   });

  //   // 5 of Diamonds and King of Diamonds should be in Player 2's discard pile; 6 of Diamonds should remain in the caravan
  //   expect(player2.discardPile.cards.length).toEqual(2);
  //   expect(player1.discardPile.cards.length).toEqual(1); // Jack is discarded after use
  // });

  it("should add cards to the player's discard pile after a Jack is played (self)", () => {
    const jackCard = createMockCard("Jack", "Diamonds");
    const kingCard = createMockCard("King", "Diamonds");

    const caravan = player1.caravans[0];
    caravan.addCard(createMockCard("5", "Diamonds"));
    caravan.cards[0].attachFaceCard(kingCard);
    caravan.addCard(createMockCard("6", "Diamonds"));

    player1.hand.push(jackCard);

    game.playTurn({
      player: player1,
      action: {
        type: "PLAY_CARD",
        card: jackCard,
        target: caravan.cards[0]
      }
    });

    // 5 of Diamonds and King of Diamonds should be in Player 1's discard pile; 6 of Diamonds should remain in the caravan
    expect(player1.discardPile.cards.length).toEqual(3); // Two cards + Jack
    // expect(player2.discardPile.cards.length).toEqual(3);
  });
});

describe("Game - General valid/invalid moves", () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
    // Skip opening rounds
    game.isOpeningRound = false;
  });

  it("should not allow playing a number card out of sequence on the same caravan.", () => {
    player1.hand = [createMockCard("3", "Diamonds"), createMockCard("8", "Hearts"), createMockCard("6", "Clubs")];

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: player1.hand[0], target: player1.caravans[0]}});
    game.currentPlayerIndex = 0;
    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: player1.hand[0], target: player1.caravans[0]}});
    game.currentPlayerIndex = 0;

    // Last card was 8 and direction is ascending (suits don't match either), so 6 is not allowed
    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: player1.hand[0], target: player1.caravans[0]}})).toThrowError(InvalidPlayError);
  });

  it("should not allow playing a number card of the same value on the caravan.", () => {
    const card8a = createMockCard("8", "Diamonds");
    const card8b = createMockCard("8", "Diamonds");

    player1.hand.push(card8a);
    player1.caravans[0].addCard(card8b);

    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: card8a, target: player1.caravans[0]}})).toThrowError(InvalidPlayError);
  });

  it("should allow changing the sequence direction with a matching suit.", () => {
    const card3 = createMockCard("3", "Diamonds");
    const card8 = createMockCard("8", "Diamonds");
    const card6 = createMockCard("6", "Diamonds");

    player1.hand.push(card3, card6);
    player1.caravans[0].addCard(card8);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: card6, target: player1.caravans[0]}});
    game.currentPlayerIndex = 0;
    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: card3, target: player1.caravans[0]}});

    expect(player1.caravans[0].cards).toEqual([card8, card6, card3]);
    expect(player1.caravans[0].direction).toEqual(Direction.DESCENDING);
  });

  it("should not allow playing a Queen anywhere other than extending a caravan.", () => {
    const queen = createMockCard("Queen", "Diamonds");
    const card7 = createMockCard("7", "Diamonds");

    player1.hand.push(queen);
    player1.caravans[0].addCard(card7);

    // Queens are used to extend caravans, not to be played on other cards.
    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: queen, target: card7}})).toThrowError(InvalidPlayError);
    game.currentPlayerIndex = 0;
    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: queen, target: player1.caravans[0]}})).not.toThrowError(InvalidPlayError);
  });

  it("should reverse the numerical sequence direction of a caravan when a Queen is played.", () => {
    const queen = createMockCard("Queen", "Diamonds");
    const card3 = createMockCard("3", "Diamonds");
    const card8 = createMockCard("8", "Diamonds");

    player1.hand.push(queen, card3);
    player1.caravans[0].addCard(card8);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: queen, target: player1.caravans[0]}});
    game.currentPlayerIndex = 0;
    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: card3, target: player1.caravans[0]}});

    expect(player1.caravans[0].cards).toEqual([card8, queen, card3]);
  });

  it("should change suit of a caravan when a Queen is played.", () => {
    const queen = createMockCard("Queen", "Hearts");
    const card3 = createMockCard("3", "Diamonds");

    player1.hand.push(queen, card3);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: card3, target: player1.caravans[0]}});
    expect(player1.caravans[0].suit).toEqual("Diamonds");

    game.currentPlayerIndex = 0;
    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: queen, target: player1.caravans[0]}});

    expect(player1.caravans[0].suit).toEqual("Hearts");
  });

  it("should not allow playing a King on another King.", () => {
    const king1 = createMockCard("King", "Diamonds");
    const king2 = createMockCard("King", "Hearts");
    const card7 = createMockCard("7", "Diamonds");

    player1.hand.push(king2);
    player1.caravans[0].addCard(card7);
    player1.caravans[0].cards[0].attachFaceCard(king1);

    // King should be attached to the 7 of Diamonds instead of the King of Diamonds.
    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: king2, target: king1}})).toThrowError(InvalidPlayError);

    expect(player1.hand.length).toEqual(9); // New card is drawn
  });
});

describe("Game - Opening rounds", () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
  });

  it("should not allow playing a card if it’s not the player’s turn.", () => {
    // Assuming it's player1's turn now.
    const valuedCard = createMockCard("3", "Hearts");
    player2.hand.push(valuedCard);

    expect(() => game.playTurn({
      player: player2,
      action: {
        type: "PLAY_CARD",
        card: valuedCard,
        target: player2.caravans[0]
      }
    })).toThrowError(InvalidPlayError);
  });

  it("should allow playing valued cards during the opening round.", () => {
    const valuedCard = createMockCard("3", "Hearts");
    player1.hand.push(valuedCard);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: valuedCard, target: player1.caravans[0]}});

    expect(player1.caravans[0].cards).toContain(valuedCard);
    expect(player1.hand).not.toContain(valuedCard);
    expect(player1.caravans[0].bid).toEqual(3);
    expect(player1.caravans[0].cards).toHaveLength(1);
    expect(player1.caravans[0].cards).toContain(valuedCard);
  });

  it("should not allow face cards during the opening round, even if there are cards in the caravans.", () => {
    const kingCard = createMockCard("King", "Diamonds");
    player1.hand.push(kingCard);

    player2.caravans[0].addCard(createMockCard("5", "Diamonds"));

    // Can't play face card during the opening round, even if there's cards in the caravans.
    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: kingCard, target: player2.caravans[0].cards[0]}})).toThrowError(InvalidPlayError);
  });

  it("should not allow discarding during the opening round.", () => {
    const valuedCard = createMockCard("5", "Diamonds");
    player1.hand.push(valuedCard);

    expect(() => game.playTurn({player: player1, action: {type: "DISCARD_DRAW", card: valuedCard}})).toThrowError(InvalidPlayError);
  });

  it("should not allow disbanding a caravan during the opening round.", () => {
    const valuedCard = createMockCard("5", "Diamonds");
    player1.hand.push(valuedCard);

    game.playTurn({player: player1, action: {type: "PLAY_CARD", card: valuedCard, target: player1.caravans[0]}});
    game.currentPlayerIndex = 0;

    // Can't disband even if there's cards in the caravan, since it's an opening round.
    expect(() => game.playTurn({player: player1, action: {type: "DISBAND_CARAVAN", caravan: player1.caravans[0]}})).toThrowError(InvalidPlayError);
  });

  it("should not allow playing cards to non-empty caravans during opening rounds.", () => {
    const valuedCard = createMockCard("5", "Diamonds");
    player1.hand.push(valuedCard);

    player1.caravans[0].addCard(createMockCard("6", "Diamonds"));
    expect(() => game.playTurn({player: player1, action: {type: "PLAY_CARD", card: valuedCard, target: player1.caravans[0]}})).toThrowError(InvalidPlayError);

  });

  it("should end opening rounds after 6 rounds (3 each player).", () => {
    expect(game.isOpeningRound).toBe(true);
    game.setAIStrategy(new EasyStrategy());

    // Play 6 turns
    for (let i = 0; i < 3; i++) {
      expect(game.isOpeningRound).toBe(true);

      const playerMoves = player1.generatePossibleMoves();
      game.playTurn(playerMoves[0]);

      game.nextAIMove();
    }

    expect(game.isOpeningRound).toBe(false);
  });
});

describe("Game - End state", () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
  });

  it("should end the game when player 1 has an empty hand with no cards left in their deck.", () => {
    // Play final turns, then check the winner.
    player1.hand = [];
    player1.cardSet = new Deck([]);

    expect(game.checkForWinner()).toBe(player2);
  });

  it("should end the game when player 2 has an empty hand with no cards left in their deck.", () => {
    // Play final turns, then check the winner.
    player2.hand = [];
    player2.cardSet = new Deck([]);

    expect(game.checkForWinner()).toBe(player1);
  });

  it("should end the game when player 1 has sold all three caravans (no outbiding needed).", () => {
    setCaravanBids(player1, [22, 24, 26]);
    setCaravanBids(player2, [18, 20, 20]);
    expect(game.checkForWinner()).toBe(player1);
  });

  it("should end the game when player 2 has sold all three caravans (no outbiding needed).", () => {
    setCaravanBids(player1, [18, 20, 20]);
    setCaravanBids(player2, [22, 24, 26]);
    expect(game.checkForWinner()).toBe(player2);
  });

  it("should end the game when a player has sold two caravans and the other player has sold a different one.", () => {
    setCaravanBids(player1, [21, 21, 0]);
    setCaravanBids(player2, [0, 0, 26]);
    expect(game.checkForWinner()).toBe(player1);
  });

  it("should end the game when a player has sold all three caravans (outbiding needed).", () => {
    setCaravanBids(player2, [22, 24, 26]);
    setCaravanBids(player1, [21, 22, 25]);
    expect(game.checkForWinner()).toBe(player2);
  });

  it("should end the game if a player has sold two caravans and there is no tie.", () => {
    setCaravanBids(player1, [22, 0, 23]);
    setCaravanBids(player2, [21, 0, 20]);
    expect(game.checkForWinner()).toBe(player1);
  });

  it("should not end the game if only one player has sold all caravans but there is a tie.", () => {
    setCaravanBids(player1, [22, 24, 23]);
    setCaravanBids(player2, [22, 0, 0]);
    expect(game.checkForWinner()).toBeNull();

    setCaravanBids(player2, [0, 24, 0]);
    expect(game.checkForWinner()).toBeNull();
    setCaravanBids(player2, [0, 0, 23]);
    expect(game.checkForWinner()).toBeNull();
  });

  it("should not end the game if a player has outsold two caravans and there is a tie.", () => {
    setCaravanBids(player1, [22, 23, 25]);
    setCaravanBids(player2, [21, 21, 25]);
    expect(game.checkForWinner()).toBeNull();
  });

  it("should not end the game if a player has outsold two caravans and is losing another.", () => {
    setCaravanBids(player1, [26, 26, 20]);
    setCaravanBids(player2, [21, 21, 25]);
    expect(game.checkForWinner()).toBeNull();
  });

  it("should not end the game if all three caravans are tied, even at selling point.", () => {
    setCaravanBids(player1, [22, 23, 25]);
    setCaravanBids(player2, [22, 23, 25]);
    expect(game.checkForWinner()).toBeNull();
  });
});

describe("AI initialization", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game([createMockPlayer(), createMockPlayer()]);
  });

  it("should have no AI strategy by default.", () => {
    expect(game.currentAIStrategy).toBeNull();
  });

  it("should be able to set an AI strategy.", () => {
    expect(game.currentAIStrategy).toBeNull();

    game.setAIStrategy(new EasyStrategy());

    expect(game.currentAIStrategy).not.toBeNull();
    expect(game.currentAIStrategy).toBeInstanceOf(EasyStrategy);
  });

  it("should throw if calling for AI move without setting an AI strategy.", () => {
    expect(() => game.nextAIMove()).toThrowError(InvalidGameState);
  });

  it("should provide a valid AI move when an AI strategy is set.", () => {
    game.setAIStrategy(new EasyStrategy());
    game.start();

    // AI player index
    game.currentPlayerIndex = 1;

    expect(() => game.nextAIMove()).not.toThrowError(InvalidPlayError);
  });
});
