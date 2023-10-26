# caravan-ts

[![Node.js testing CI](https://github.com/AtilioA/caravan-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/AtilioA/caravan-ts/actions/workflows/ci.yml) | [![codecov](https://codecov.io/gh/AtilioA/caravan-ts/graph/badge.svg?token=I3D616S25M)](https://codecov.io/gh/AtilioA/caravan-ts)

## Caravan: A Fallout: New Vegas Card Game

Originating from the popular video game Fallout: New Vegas, Caravan offers a blend of strategy and luck, pitting two players against each other in a race to sell their caravans.

### Objective

The aim is to sell two or three of your caravans with a higher sum than your opponent. A caravan's bid is the total of its number cards, including any multipliers from Kings. To be considered "sold," a caravan must have a bid between 21-26.

### Rules
First and foremost, special thanks to /u/NedvedPetrXbox for their [rules breakdown on Reddit](https://www.reddit.com/r/cardgames/comments/97c7g2/caravan_card_game_in_reallife_detailed_rules/). Use it as a general reference for the rules of the game implemented in this project, just not that the post is more focused on transposing the card game to a real-life setting and may not be totally applicable to this digital recreation at certain points.

Caravan's rules are a bit complex and inconsistent throughout the game; the game has a few discrepancies between the in-game tutorial and the actual gameplay. This project aims to implement the rules as faithfully as possible to the actual rules set out in the game, so it may not match the in-game logic. Discrepancies are thoroughly discussed in the aforementioned Reddit post.

Furthermore, this project was developed using a test-driven development (TDD) approach, so the tests are a great resource for understanding the rules of the game.

## Installation & Setup
`caravan-ts` has zero dependencies, so installation is straightforward through npm:

```bash
npm install caravan-ts
```

### Basic Usage
WIP

### Documentation
To generate the documentation, run the following command:

```bash
npm run docs
```

`typedoc` will generate a `docs` folder in the root directory containing the documentation. Open `docs/index.html` in your browser to view the documentation.

## Disclaimer and Acknowledgements

This project is a fan-made representation of the "Caravan" mini-game as featured in Bethesda Softworks' Fallout: New Vegas. It is created out of admiration and respect for the original game and its creators.

This project is not affiliated with, endorsed by, or officially connected with Bethesda Softworks or any of its subsidiaries or affiliates. The mini-game "Caravan" and any related trademarks or intellectual property from "Fallout: New Vegas" remain the property of their respective trademark holders.

This project is non-commercial. It's made available for free, and there are no plans for monetization. The primary goal is personal learning and sharing with the fan community. No copyrighted assets from Fallout: New Vegas or related properties have been used.

The code for this project is open source; please refer to the LICENSE file for more information.
