import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ListableObject } from './listable-object.model';
import { SetViewMode } from '../../view-mode';

const dsoElementMap = new Map();
export function renderElementsFor(listable: GenericConstructor<ListableObject>, viewMode: SetViewMode) {
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

export function rendersDSOType(listable: GenericConstructor<ListableObject>, viewMode: SetViewMode) {
  return dsoElementMap.get(viewMode).get(listable);
}
