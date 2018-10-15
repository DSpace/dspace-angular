import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ListableObject } from './listable-object.model';
import { ViewMode } from '../../../core/shared/view-mode.model';

const dsoElementMap = new Map();
export function renderElementsFor(listable: GenericConstructor<ListableObject>, viewMode: ViewMode) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    if (!dsoElementMap.get(viewMode)) {
      dsoElementMap.set(viewMode, new Map());
    }
    dsoElementMap.get(viewMode).set(listable, objectElement);
  };
}

export function rendersDSOType(listable: GenericConstructor<ListableObject>, viewMode: ViewMode) {
  return dsoElementMap.get(viewMode).get(listable);
}
