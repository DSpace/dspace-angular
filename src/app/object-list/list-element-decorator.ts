import { ListableObject } from './listable-object/listable-object.model';
import { GenericConstructor } from '../core/shared/generic-constructor';

const listElementMap = new Map();
export function listElementFor(listable: GenericConstructor<ListableObject>) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    listElementMap.set(listable, objectElement);
  };
}

export function getListElementFor(listable: GenericConstructor<ListableObject>) {
  return listElementMap.get(listable);
}
