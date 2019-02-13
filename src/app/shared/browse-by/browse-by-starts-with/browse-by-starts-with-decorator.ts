import { BrowseByStartsWithType } from '../browse-by.component';

const startsWithMap = new Map();

/**
 * Fetch a decorator to render a StartsWith component for type
 * @param type
 */
export function renderStartsWithFor(type: BrowseByStartsWithType) {
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
export function getStartsWithComponent(type: BrowseByStartsWithType) {
  return startsWithMap.get(type);
}
