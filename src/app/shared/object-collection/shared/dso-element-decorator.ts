import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ListableObject } from './listable-object.model';
import { ViewMode } from '../../../+search-page/search-options.model';

const dsoElementMap = new Map();
export function renderElementsFor(listable: GenericConstructor<ListableObject>, viewMode : ViewMode) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    dsoElementMap.set(listable+viewMode, objectElement);
  };
}

export function rendersDSOType(listable: GenericConstructor<ListableObject>, viewMode : ViewMode) {
  return dsoElementMap.get(listable+viewMode);
}
