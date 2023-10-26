import { ICaravan } from "../models/interfaces/ICaravan";
import { ICard } from "../models/interfaces/ICard";

/**
 * Determines if the provided target is of type ICaravan.
 * @param target The target to check.
 * @returns True if target is ICaravan, otherwise false.
 */
export function isCaravan(target: ICaravan | ICard): target is ICaravan {
  return (target as ICaravan).bid !== undefined;
}
