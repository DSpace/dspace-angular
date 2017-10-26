import { GenericConstructor } from '../core/shared/generic-constructor';
import { ListableObject } from '../object-collection/shared/listable-object.model';

const gridElementMap = new Map();
export function gridElementFor(gridable: GenericConstructor<ListableObject>) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    gridElementMap.set(gridable, objectElement);
  };
}

export function getGridElementFor(gridable: GenericConstructor<ListableObject>) {
  return gridElementMap.get(gridable);
}
