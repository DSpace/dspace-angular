import { BrowseByStartsWithType } from '../browse-by.component';

const startsWithMap = new Map();

export function renderStartsWithFor(type: BrowseByStartsWithType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    startsWithMap.set(type, objectElement);
  };
}

export function getStartsWithComponent(type: BrowseByStartsWithType) {
  return startsWithMap.get(type);
}
