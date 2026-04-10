import { StartsWithDateComponent } from './date/starts-with-date.component';
import { StartsWithType } from './starts-with-type';
import { StartsWithTextComponent } from './text/starts-with-text.component';


type StartsWithComponentType = typeof StartsWithDateComponent | typeof StartsWithTextComponent;
export const STARTS_WITH_DECORATOR_MAP = new Map<StartsWithType, StartsWithComponentType>([
  [StartsWithType.text, StartsWithTextComponent],
  [StartsWithType.date, StartsWithDateComponent],
]);

/**
 * Fetch a decorator to render a StartsWith component for type
 * @param type
 * @deprecated
 */
export function renderStartsWithFor(type: StartsWithType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    STARTS_WITH_DECORATOR_MAP.set(type, objectElement);
  };
}

/**
 * Get the correct component depending on the StartsWith type
 * @param type
 */
export function getStartsWithComponent(type: StartsWithType) {
  return STARTS_WITH_DECORATOR_MAP.get(type);
}
