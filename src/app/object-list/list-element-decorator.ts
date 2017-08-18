import { ListableObject } from './listable-object/listable-object.model';
import { GenericConstructor } from '../core/shared/generic-constructor';

const listElementForMetadataKey = Symbol('listElementFor');

export function listElementFor(value: GenericConstructor<ListableObject>) {
  return Reflect.metadata(listElementForMetadataKey, value);
}

export function getListElementFor(target: any) {
  return Reflect.getOwnMetadata(listElementForMetadataKey, target);
}
