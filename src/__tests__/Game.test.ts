import { InvalidGameState } from "../exceptions/GameExceptions";
import { Deck } from "../models/Deck";
import { Game } from "../models/Game";
import { ICaravan } from "../models/interfaces/ICaravan";
import { IPlayer } from "../models/interfaces/IPlayer";
import { generateCards } from "../utils/card";
import { createMockCaravan, createMockCard, createMockPlayer } from "./__mocks__/mockFactories";


describe('Game - Initialization', () => {
  // let drawHandCallCount = 0;

  // beforeEach(() => {
  //   drawHandCallCount = 0;
  // });
  it('should initialize the game with the correct initial state', () => {
    const game = new Game();
    expect(game.players.length).toEqual(0);
  });

  it('should not start a game with less than two players', () => {
    const game = new Game();

    expect(game.players.length).toEqual(0);
    expect(() => game.start()).toThrowError(InvalidGameState);
    expect(game.players.length).toEqual(0);
  });

  it('should not start the game with the more than two players', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer(), createMockPlayer()]
    const game = new Game(mockPlayers);

    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it('should not start a game with a player with less than 30 cards', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()]
    mockPlayers[0].cardSet = new Deck(generateCards(29));

    const game = new Game(mockPlayers);
    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it('should not start a game with a player with more than 216 cards', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()]
    mockPlayers[0].cardSet = new Deck(generateCards(217));

    const game = new Game(mockPlayers);
    expect(() => game.start()).toThrowError(InvalidGameState);
  });

  it('should start the game, dealing 8 cards to each player', () => {
    const mockPlayers = [createMockPlayer(), createMockPlayer()]
    const game = new Game(mockPlayers);
    game.start();

    expect(mockPlayers[0].hand.length).toEqual(8);
    expect(mockPlayers[1].hand.length).toEqual(8);
  });

    // it('should validate a player’s move correctly', () => {
  //   const mockPlayers = [createMockPlayer(), createMockPlayer()]
  //   const game = new Game(mockPlayers);
  //   game.start();

  //   const cardIndex = 0; // or any valid index
  //   const caravanIndex = 0; // or any valid index

  //   expect(game.validateMove(mockPlayers[0], cardIndex, caravanIndex)).toBe(true);
  // });

  // it('should reshuffle a player deck if they do not have at least three valued cards, and draw eight new cards', () => {
  //   const mockPlayers = [new MockedPlayer(), new MockedPlayer()]

  //   // mockPlayers[0].drawHand = jest.fn((n) => {
  //   //     drawHandCallCount++;

  //   //     if (drawHandCallCount === 1) {
  //   //         mockPlayers[0].hand = [ getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace(), getRandomCardFace() ];
  //   //     } else {
  //   //         mockPlayers[0].hand = generateCards(8, false);
  //   //     }
  //   // });

  //   const game = new Game(mockPlayers);

  //   // const mockHand = [...Array(8).keys()].map(_ => {
  //   //   return { isFaceCard: jest.fn(() => true) } as unknown as ICard;
  //   // });

  //   // const drawHandSpy1 = jest.spyOn(mockPlayers[0], 'drawHand').mockImplementation((n: number) => {
  //   //   mockPlayers[0].hand = mockHand;
  //   // });

  //   // const drawHandSpy2 = jest.spyOn(mockPlayers[1], 'drawHand').mockImplementation((n: number) => {
  //   //   mockPlayers[1].hand = mockHand;
  //   // });

  //   game.start();

  //   // Now, make the assertion
  //   const valuedCardsPlayer1 = mockPlayers[0].hand.filter(card => !card.isFaceCard());
  //   const valuedCardsPlayer2 = mockPlayers[1].hand.filter(card => !card.isFaceCard());

  //   expect(valuedCardsPlayer1.length).toBeGreaterThanOrEqual(3);
  //   expect(valuedCardsPlayer2.length).toBeGreaterThanOrEqual(3);

  //   // drawHandSpy1.mockRestore();
  //   // drawHandSpy2.mockRestore();
  // });
});

describe('Game - Playing turns', () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
  });

  it('should allow a player to play a valued card on their caravan', () => {
    const valuedCard = createMockCard("2", "Diamonds");
    player1.hand.push(valuedCard);

    game.playTurn({type: 'PLAY_CARD', card: valuedCard, target: player1.caravans[0]});

    expect(player1.caravans[0].cards).toContain(valuedCard);
    expect(player1.hand).not.toContain(valuedCard);
  });

  it('should update the caravan\'s bid after a player plays a valued card on their caravan', () => {
    const valuedCard = createMockCard("2", "Diamonds");
    player1.hand.push(valuedCard);

    game.playTurn({type: 'PLAY_CARD', card: valuedCard, target: player1.caravans[0]});

    expect(player1.caravans[0].bid).toEqual(2);
  });

  // TODO: Continue from here
  it('should allow a player to play a face card on their cards', () => {
    const faceCard = createMockCard("King", "Diamonds");
    const valuedCard = createMockCard("5", "Diamonds");

    player1.hand.push(faceCard);
    player1.caravans[0].addCard(valuedCard);

    game.playTurn({type: 'PLAY_CARD', card: faceCard, target: valuedCard});

    expect(valuedCard.attachedCards).toContain(faceCard);
    expect(player1.hand).not.toContain(faceCard);
  });

  it('should update the caravan\'s bid after a player plays a face card on their cards', () => {
    const faceCard = createMockCard("King", "Diamonds");
    const valuedCard = createMockCard("7", "Diamonds");

    player1.hand.push(faceCard);
    player1.caravans[0].addCard(valuedCard);

    game.playTurn({type: 'PLAY_CARD', card: faceCard, target: valuedCard});

    expect(player1.caravans[0].bid).toEqual(14);
  });

  it('should allow a player to play a face card on their opponent’s cards', () => {
    const faceCard = createMockCard("Queen", "Hearts");
    const valuedCard = createMockCard("7", "Hearts");

    player1.hand.push(faceCard);
    player2.caravans[1].cards.push(valuedCard);

    game.playTurn({type: 'PLAY_CARD', card: faceCard, target: valuedCard});

    expect(valuedCard.attachedCards).toContain(faceCard);
    expect(player1.hand).not.toContain(faceCard);
  });

  it('should not allow a player to play a valued card on their opponent’s caravan', () => {
    const valuedCard = createMockCard("8", "Clubs");

    player1.hand.push(valuedCard);

    game.playTurn({type: 'PLAY_CARD', card: valuedCard, target: player2.caravans[0]});

    expect(player1.caravans[1].cards).not.toContain(valuedCard);
    expect(player1.hand).toContain(valuedCard);
  });

  it('should determine the winner correctly based on the game\'s rules', () => {
      // Mock the game state to be near the end, with clearly defined winning conditions.
      // ...

      // Play final turns, then check the winner.
      game.playTurn({type: 'PLAY_CARD', card: player1.hand[0], target: player1.caravans[0]});

      expect(game.checkForWinner()).toBe(player1);  // Or player2
  });


  it('should not allow playing a card if it’s not the player’s turn', () => {
      // Assuming it's player1's turn now.
      const valuedCard = createMockCard("3", "Hearts");
      player2.hand.push(valuedCard);

      expect(() => game.playTurn({type: 'PLAY_CARD', card: valuedCard, target: player2.caravans[0]})).toThrow();
  });

  it('should not allow a player to discard and draw a card if it\'s not their turn', () => {
    const valuedCard = createMockCard("3", "Hearts");
    player2.hand.push(valuedCard);

    expect(() => game.playTurn({type: 'DISCARD_DRAW', card: valuedCard})).toThrow();
  });

  it('should not allow a player to disbanding a caravan if it\'s not their turn', () => {
    const valuedCard = createMockCard("3", "Hearts");
    player2.hand.push(valuedCard);

    expect(() => game.playTurn({type: 'DISCARD_DRAW', card: valuedCard})).toThrow();
  });

  it('should handle the end of the game correctly, allowing no more moves after the game ends', () => {
      // Mock the game to be at an end state.
      game.end();

      const valuedCard = createMockCard("3", "Hearts");
      player1.hand.push(valuedCard);

      expect(() => game.playTurn({type: 'PLAY_CARD', card: valuedCard, target: player1.caravans[0]})).toThrow();
  });

  it('should consider a caravan as sold only between a bid of 21-26', () => {
      const caravan = player1.caravans[0];
      player1.hand.push(createMockCard("10", "Diamonds"));
      player1.hand.push(createMockCard("9", "Diamonds"));
      player1.hand.push(createMockCard("7", "Diamonds"));

      game.playTurn({type: 'PLAY_CARD', card: player1.hand[0], target: caravan});
      // Bid is 10
      expect(caravan.isSold()).toBe(false);

      game.playTurn({type: 'PLAY_CARD', card: player1.hand[1], target: caravan});
      // Bid is 19
      expect(caravan.isSold()).toBe(false);

      game.playTurn({type: 'PLAY_CARD', card: player1.hand[2], target: caravan});
      // Bid is 26, caravan is sold
      expect(caravan.isSold()).toBe(true);
  });

  it('should allow a player to disband one of their caravans if it has any cards', () => {
      const caravan = player1.caravans[0];
      caravan.addCard(createMockCard("5", "Diamonds"));

      game.playTurn({type: 'DISBAND_CARAVAN', caravan: caravan});

      expect(caravan.cards.length).toEqual(0);
      expect(caravan.bid).toEqual(0);
  });

  it('should not allow a player to disband one of their caravans if it has no cards', () => {
      const caravan = player1.caravans[0];

      expect(() => game.playTurn({type: 'DISBAND_CARAVAN', caravan: caravan})).toThrow();
  });

  it('should add cards to the player\'s discard pile after a caravan is discarded', () => {
      const caravan = player1.caravans[0];
      caravan.addCard(createMockCard("5", "Diamonds"));
      caravan.addCard(createMockCard("6", "Diamonds"));

      game.playTurn({type: 'DISBAND_CARAVAN', caravan: caravan});

      expect(player1.discardPile.cards.length).toEqual(2);
  });

  it('should add cards to the player\'s discard pile after a Jack is played (opponent)', () => {
    const jackCard = createMockCard("Jack", "Diamonds");
    const kingCard = createMockCard("King", "Diamonds");

    const caravan = player2.caravans[0];
    caravan.addCard(createMockCard("5", "Diamonds"));
    caravan.cards[0].attachFaceCard(kingCard);
    caravan.addCard(createMockCard("6", "Diamonds"));

    player1.hand.push(jackCard);

    game.playTurn({type: 'PLAY_CARD', card: jackCard, target: caravan.cards[0]});

    // 5 of Diamonds and King of Diamonds should be in Player 2's discard pile; 6 of Diamonds should remain in the caravan
    expect(player2.discardPile.cards.length).toEqual(2);
    expect(player1.discardPile.cards.length).toEqual(1); // Jack is discarded after use
  });

  it('should add cards to the player\'s discard pile after a Jack is played (self)', () => {
    const jackCard = createMockCard("Jack", "Diamonds");
    const kingCard = createMockCard("King", "Diamonds");

    const caravan = player1.caravans[0];
    caravan.addCard(createMockCard("5", "Diamonds"));
    caravan.cards[0].attachFaceCard(kingCard);
    caravan.addCard(createMockCard("6", "Diamonds"));

    player1.hand.push(jackCard);

    game.playTurn({type: 'PLAY_CARD', card: jackCard, target: caravan.cards[0]});

    // 5 of Diamonds and King of Diamonds should be in Player 1's discard pile; 6 of Diamonds should remain in the caravan
    expect(player1.discardPile.cards.length).toEqual(3); // Two cards + Jack
    expect(player2.discardPile.cards.length).toEqual(0); // Two cards + Jack
  });
});

// describe('Game - Opening rounds', () => {
//   let game: Game;
//   let player1: IPlayer;
//   let player2: IPlayer;

//   beforeEach(() => {
//     player1 = createMockPlayer();
//     player2 = createMockPlayer();

//     game = new Game([player1, player2]);
//     game.start();
//   });

//   it('should allow playing valued cards during the opening round', () => {
//     const valuedCard = createMockCard("3", "Hearts");
//     player1.hand.push(valuedCard);

//     game.playTurn({type: 'PLAY_CARD', card: valuedCard, target: player1.caravans[0]});

//     expect(player1.caravans[0].cards).toContain(valuedCard);
//     expect(player1.hand).not.toContain(valuedCard);
//   });

//   it('should not allow face cards during the opening round, even if there are cards in the caravans.', () => {
//     const kingCard = createMockCard("King", "Diamonds");
//     player1.hand.push(kingCard);

//     player2.caravans[0].addCard(createMockCard("5", "Diamonds"));

//     // Can't play face card during the opening round, even if there's cards in the caravans.
//     expect(() => game.playTurn({type: 'PLAY_CARD', card: kingCard, target: player2.caravans[0].cards[0]})).toThrow();
//   });

//   it('should not allow discarding during the opening round', () => {
//     const valuedCard = createMockCard("5", "Diamonds");
//     player1.hand.push(valuedCard);

//     expect(() => game.playTurn({type: 'DISCARD_DRAW', card: valuedCard})).toThrow();
//   });
// });

describe('Game - End state', () => {
  let game: Game;
  let player1: IPlayer;
  let player2: IPlayer;

  beforeEach(() => {
    player1 = createMockPlayer();
    player2 = createMockPlayer();

    game = new Game([player1, player2]);
    game.start();
  });

  const setCaravanBids = (player: IPlayer, bids: number[]) => {
    player.caravans.forEach((caravan, index) => caravan.bid = bids[index]);
  };

  it('should end the game when a player has an empty hand with no cards left in their deck', () => {
    // Play final turns, then check the winner.
    player1.hand = [];
    player1.cardSet = new Deck([]);

    expect(game.checkForWinner()).toBe(player2);
});

  it('should end the game when a player has sold all three caravans', () => {
    setCaravanBids(player1, [22, 24, 26]);
    setCaravanBids(player2, [18, 20, 20]);
    expect(game.checkForWinner()).toBe(player1);
  });

  it('should end the game when a player has sold two caravans and another one has sold only one', () => {
    setCaravanBids(player1, [21, 21, 0]);
    setCaravanBids(player2, [0, 0, 26]);
    expect(game.checkForWinner()).toBe(player1);
  });

  it('should end the game when a player has sold all three caravans (outbiding)', () => {
    setCaravanBids(player2, [22, 24, 26]);
    setCaravanBids(player1, [21, 22, 25]);
    expect(game.checkForWinner()).toBe(player2);
  });

  it('should end the game if a player has sold two caravans and there is no tie', () => {
    setCaravanBids(player1, [22, 0, 23]);
    setCaravanBids(player2, [21, 0, 20]);
    expect(game.checkForWinner()).toBe(player1);
  });

  it('should not end the game if only one player has sold all caravans but there is a tie', () => {
    setCaravanBids(player1, [22, 24, 23]);
    setCaravanBids(player2, [22, 0, 0]);
    expect(game.checkForWinner()).toBeNull();

    setCaravanBids(player2, [0, 24, 0]);
    expect(game.checkForWinner()).toBeNull();
    setCaravanBids(player2, [0, 0, 23]);
    expect(game.checkForWinner()).toBeNull();
  });

  it('should not end the game if a player has outsold two caravans and there is a tie', () => {
    setCaravanBids(player1, [22, 23, 25]);
    setCaravanBids(player2, [21, 21, 25]);
    expect(game.checkForWinner()).toBeNull();
  });

  it('should not end the game if all three caravans are tied, even at selling point', () => {
    setCaravanBids(player1, [22, 23, 25]);
    setCaravanBids(player2, [22, 23, 25]);
    expect(game.checkForWinner()).toBeNull();
  });
});

// describe('Game - Joker', () => {
//     // it('should handle special cards (like Joker) and their effects on the game state correctly', () => {
//   //     const jokerCard = createMockCard("Joker", "Diamonds")
//   //     player1.hand.push(jokerCard);

//   //     game.playTurn({type: 'PLAY_CARD', card: jokerCard, target: player1.caravans[0]});

//   //     // Validate effects of Joker here
//   // });
// });
