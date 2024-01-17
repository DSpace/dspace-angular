import { StartsWithDateComponent } from './date/starts-with-date.component';
import { StartsWithTextComponent } from './text/starts-with-text.component';

const startsWithMap = new Map();

/**
 * An enum that defines the type of StartsWith options
 */
export enum StartsWithType {
  text = 'Text',
  date = 'Date'
}

startsWithMap.set(StartsWithType.text, StartsWithTextComponent);
startsWithMap.set(StartsWithType.date, StartsWithDateComponent);


/**
 * Fetch a decorator to render a StartsWith component for type
 * @param type
 */
export function renderStartsWithFor(type: StartsWithType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    startsWithMap.set(type, objectElement);
  };
}

/**
 * Get the correct component depending on the StartsWith type
 * @param type
 */
export function getStartsWithComponent(type: StartsWithType) {
  return startsWithMap.get(type);
}
