// import { Deck } from "../../models/Deck";
// import { ICaravan } from "../../models/interfaces/ICaravan";
// import { ICard } from "../../models/interfaces/ICard";
// import { IDeck } from "../../models/interfaces/IDeck";
// import { IPlayer } from "../../models/interfaces/IPlayer";
// import { createMockDeck } from "./mockFactories";

// MockedPlayer.ts
// export class MockedPlayer implements IPlayer {
//   hand: ICard[] = [];
//   cardSet: IDeck = createMockDeck();
//   discardPile: IDeck = new Deck();
//   mockHand: ICard[] = [];
//   caravans: ICaravan[] = [];

//   drawCard(): void {
//     // mocked implementation or jest.fn()
//   }

//   drawHand(n: number): void {
//     this.hand = this.mockHand
//   }

//   playCard(card: ICard, caravan: ICaravan): void {
//     // mocked implementation or jest.fn()
//   }

//   discardCard(card: ICard): void {
//     // mocked implementation or jest.fn()
//   }

//   isNotOwnCaravan(caravan: ICaravan): boolean {
//     return false; // or jest.fn()
//   }

//   playCardToOpponentCaravan(faceCard: ICard, enemyCard: ICard): boolean {
//     return true; // or jest.fn()
//   }
// }
