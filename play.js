const readline = require('readline');
const chalk = require('chalk');
const { Game } = require('./dist/models/Game');
const { Player } = require('./dist/models/Player');
const { Deck } = require('./dist/models/Deck');
const { RandomStrategy } = require('./dist/models/AI/RandomStrategy');
const { generateCards } = require('./dist/utils/card');
const { exit } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let game;

function getCardString(card) {
  function getAttachedCardsString(card) {
    return card.attachedCards.length > 0 ? `(${card.attachedCards.map(getBaseCardString).join('+')})` : '';
  }

  function getBaseCardString(card) {
    if (card.isFaceCard()) {
      return card.value + card.suit[0]
    } else {
      return card.getNumericValue() + card.suit[0]
    }
  }

  return getBaseCardString(card) + getAttachedCardsString(card);
}

function logGameState() {
  const gameState = game.getCurrentGameState();

  // Helper function to pad strings for better alignment
  const padString = (str, length) => str.padEnd(length, ' ');

  // Helper function to style the bid based on its value
  const styleBid = (bid) => {
    if (bid === 0) {
      return chalk.gray(bid.toString()); // grayed-out if 0
    } else if (bid >= 1 && bid <= 20) {
      return chalk.bold.white(bid.toString()); // white if between 1-20
    } else if (bid >= 21 && bid <= 26) {
      return chalk.bold.yellow(bid.toString()); // bold yellow if 21-26
    } else {
      return chalk.bold.rgb(255, 50, 0)(bid.toString()); // bold orange if 27+
    }
  };

  // 'Standard' width for card strings
  const cardWidth = 3;

  let players = [gameState.human, gameState.AI];
  players.forEach((player, index) => {
    // Background colors for player headers
    const playerHeader = index === game.currentPlayerIndex ? chalk.bold.bgRedBright : chalk.bold;
    console.log(playerHeader('\nPlayer ' + (index + 1) + ':'));
    console.log('Deck size:', player.cardSet.getSize());

    // Create a padded hand string
    const handString = player.hand
      .map((card, index) => `${index+1}:${chalk.bold.cyan(getCardString(card).padEnd(cardWidth, ' '))}`)
      .join(' ');
    console.log('Hand:    ', handString);

    console.log(chalk.bold('Caravans:'));
    player.caravans.forEach((caravan, caravanIndex) => {
      // Create a padded caravan cards string
      const caravanCards = caravan.cards.map(card => getCardString(card).padEnd(cardWidth, ' ')).join(' ');
      const styledBid = styleBid(caravan.bid); // Get the styled bid
      console.log(`  Caravan ${caravanIndex + 1}:`, padString(caravanCards, cardWidth * 6), 'Bid:', styledBid);
    });
  });

  console.log();
}

function promptUser() {
  rl.question('Choose an action: (play, disband, discard, quit) ', (action) => {
    switch (action) {
      case 'play':
      case 'p':
        promptPlayCard();
        break;
      case 'disband':
        promptDisbandCaravan();
        break;
      case 'discard':
      case 'd':
        promptDiscardCard();
        break;
      case 'quit':
      case 'q':
        rl.close();
        break;
      default:
        console.log(chalk.red('Invalid action. Please choose a valid action: play, disband, discard, quit'));
        promptUser();
        break;
    }
  });
}

function promptPlayCard() {
  rl.question('Enter the card to play (index in hand): ', (cardIndexStr) => {
    const cardIndex = parseInt(cardIndexStr) - 1;
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= game.getCurrentPlayer().hand.length) {
      console.log(chalk.red('Invalid card index. Please enter a valid index.'));
      return promptPlayCard();
    }

    rl.question('Enter the target (caravan index or card index in caravan): ', (targetIndexStr) => {
      // If there are two numbers, the first is the caravan index and the second is the card index
      let caravanIndex;
      let cardInCaravanIndex;
      const targetIndices = targetIndexStr.split(' ');
      if (targetIndices.length > 2) {
        console.log(chalk.red('Invalid target. Please enter a valid index.'));
        return promptPlayCard();
      } else {
        if (targetIndices.length === 1) {
          caravanIndex = parseInt(targetIndices[0]) - 1;
        }
        else {
          caravanIndex = parseInt(targetIndices[0]) - 1;
          cardInCaravanIndex = parseInt(targetIndices[1]) - 1;
        }
      }

      if (isNaN(caravanIndex) || caravanIndex < 0 || caravanIndex > 2) {
        console.log(chalk.red('Invalid caravan target. Please enter a valid index.'));
        return promptPlayCard();
      }

      if (cardInCaravanIndex && isNaN(cardInCaravanIndex) || cardInCaravanIndex < 0) {
        console.log(chalk.red(`Invalid card target from caravan ${caravanIndex + 1}. Please enter a valid index.`));
        return promptPlayCard();
      }

      // Determine if the target is a caravan or a card within a caravan
      let target;
      if (cardInCaravanIndex !== undefined && cardInCaravanIndex >= 0) {
        target = game.getCurrentPlayer().caravans[caravanIndex].cards[cardInCaravanIndex];
      }
      else if (caravanIndex >= 0 && caravanIndex < game.getCurrentPlayer().caravans.length) {
        target = game.getCurrentPlayer().caravans[caravanIndex];
      } else {
        console.log(chalk.red('Invalid card/caravan index. Please enter a valid index.'));
        return promptPlayCard();
      }

      try {
        game.playTurn({
          action: {
            type: 'PLAY_CARD',
            card: game.getCurrentPlayer().hand[cardIndex],
            target: target,
          },
          player: game.getCurrentPlayer(),
        });

        promptUser();
      } catch (error) {
        console.error(chalk.bold.red(`\nError: ${error.message}`));
        promptUser();
      }
    });
  });
}

function promptDisbandCaravan() {
  rl.question('Enter the caravan to disband (index): ', (caravanIndexStr) => {
    const caravanIndex = parseInt(caravanIndexStr) - 1;
    if (isNaN(caravanIndex) || caravanIndex < 0 || caravanIndex >= game.getCurrentPlayer().caravans.length) {
      console.log(chalk.red('Invalid caravan index. Please enter a valid index.'));
      return promptDisbandCaravan();
    }

    try {
      game.playTurn({
        action: {
          type: 'DISBAND_CARAVAN',
          caravan: game.getCurrentPlayer().caravans[caravanIndex],
        },
        player: game.getCurrentPlayer(),
      });

      promptUser();
    } catch (error) {
      console.error(chalk.bold.red(`\nError: ${error.message}`));
      promptUser();
    }
  });
}

function promptDiscardCard() {
  rl.question('Enter the card to discard (index in hand): ', (cardIndexStr) => {
    const cardIndex = parseInt(cardIndexStr) - 1;
    if (isNaN(cardIndex) || cardIndex < 0 || cardIndex >= game.getCurrentPlayer().hand.length) {
      console.log(chalk.red('Invalid card index. Please enter a valid index.'));
      return promptDiscardCard();
    }

    try {
      game.playTurn({
        action: {
          type: 'DISCARD_DRAW',
          card: game.getCurrentPlayer().hand[cardIndex],
        },
        player: game.getCurrentPlayer(),
      });

      promptUser();
    } catch (error) {
      console.error(chalk.bold.red(`\nError: ${error.message}`));
      promptUser();
    }
  });
}

function handleTurn() {
  if (game.currentPlayerIndex === 0) {
    // Human player's turn
    logGameState();
    promptUser();
  } else {
    // AI's turn
    game.nextAIMove();
    // After AI move, check game status or switch to human's turn
    // Not needed because of events
    // checkGameStatus();
  }
}

function checkGameStatus() {
  // Not needed because of events
  // if (game.isOver) {
  //   const winner = game.getWinner();
  //   console.log(chalk.bold(`Game over! The winner is: ${winner === 0 ? 'Human' : 'AI'}`));
  //   rl.close();
  //   exit();
  // } else {
    // If the game is not over, proceed to the next turn
    handleTurn();
  // }
}

function startGame() {
  const humanPlayer = new Player(new Deck(generateCards(30, true)));
  const aiPlayer = new Player(new Deck(generateCards(30, true)));

  game = new Game([humanPlayer, aiPlayer]);
  game.setAIStrategy(new RandomStrategy())

  game.events.on('nextTurn', () => {
    checkGameStatus(); // Proceed to next turn or end the game if over
  });

  game.events.on('gameOver', ({ winner }) => {
    logGameState();
    const gameState = game.getCurrentGameState();
    console.log(chalk.bold(`Game over! The winner is the ${gameState.human === winner ? 'human' : 'AI'}!`));
    rl.close();
    exit();
  });

  game.start();

  // Begin the first turn
  handleTurn();
}

startGame();
