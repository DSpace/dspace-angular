import { defer } from 'rxjs';

const startsWithMap = new Map();

/**
 * An enum that defines the type of StartsWith options
 */
export enum StartsWithType {
  text = 'Text',
  date = 'Date'
}

startsWithMap.set(StartsWithType.text, defer(() => import('./text/starts-with-text.component').then(m => m.StartsWithTextComponent)));
startsWithMap.set(StartsWithType.date, defer(() => import('./date/starts-with-date.component').then(m => m.StartsWithDateComponent)));


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
