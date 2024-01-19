import { StartsWithDateComponent } from './date/starts-with-date.component';
import { StartsWithTextComponent } from './text/starts-with-text.component';

/**
 * An enum that defines the type of StartsWith options
 */
export enum StartsWithType {
  text = 'Text',
  date = 'Date'
}

type StartsWithComponentType = typeof StartsWithDateComponent | typeof StartsWithTextComponent;
export const STARTS_WITH_DECORATOR_MAP = new Map<StartsWithType, StartsWithComponentType>([
  [StartsWithType.text,StartsWithTextComponent],
  [StartsWithType.date,StartsWithDateComponent],
]);

/**
 * Fetch a decorator to render a StartsWith component for type
 * @param type
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
