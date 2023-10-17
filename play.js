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
  return card.getNumericValue() + card.suit[0]
}

function logGameState() {
  const gameState = game.getCurrentGameState();

  // You can create a helper function to pad strings for better alignment
  const padString = (str, length) => str.padEnd(length, ' ');

  // Define standard widths for certain fields
  const cardWidth = 3; // The width of a card string (e.g., "4S", "10H"), adjust if necessary

  let players = [gameState.human, gameState.AI];
  players.forEach((player, index) => {
    // Use background colors for player headers for better visibility
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
      console.log(`  Caravan ${caravanIndex + 1}:`, padString(caravanCards, cardWidth * 6), `Bid: ${caravan.bid}`); // Assume a max of 8 cards for padding, adjust if necessary
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
      const targetIndex = parseInt(targetIndexStr) - 1;
      if (isNaN(targetIndex)) {
        console.log(chalk.red('Invalid target. Please enter a valid index.'));
        return promptPlayCard();
      }

      // Determine if the target is a caravan or a card within a caravan
      let target;
      if (targetIndex >= 0 && targetIndex < game.getCurrentPlayer().caravans.length) {
        target = game.getCurrentPlayer().caravans[targetIndex];
      } else {
        console.log(chalk.red('Invalid caravan index. Please enter a valid index.'));
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
  const humanPlayer = new Player(new Deck(generateCards(30)));
  const aiPlayer = new Player(new Deck(generateCards(30)));

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
