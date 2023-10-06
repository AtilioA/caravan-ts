import { ICaravan } from "../models/interfaces/ICaravan";
import { ICard } from "../models/interfaces/ICard";

export function isCaravan(target: ICaravan | ICard): target is ICaravan {
  return (target as ICaravan).bid !== undefined;
}
