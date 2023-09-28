import { Card } from "../models/Card";
import { Deck } from "../models/Deck";
import { Player } from "../models/Player";

describe('Player', () => {
    it('should create a player with an empty set of cards', () => {
        const player = new Player();
        expect(player.cards.length).toEqual(0);
    });

    it('should create a player with a set of cards', () => {
        const playerDeck = new Deck();
        playerDeck.generate(40);
        const player = new Player(playerDeck.cards);
        expect(player.cards.length).toEqual(0);
    });
});
