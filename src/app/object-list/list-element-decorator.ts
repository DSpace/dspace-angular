import { GenericConstructor } from '../core/shared/generic-constructor';
import { ListableObject } from '../object-collection/shared/listable-object.model';

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
