import { ViewMode } from '../../../../core/shared/view-mode.model';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { ListableObject } from '../listable-object.model';
import { Context } from '../../../../core/shared/context.model';
import { hasNoValue, hasValue } from '../../../empty.util';
import { DEFAULT_CONTEXT } from '../../../metadata-representation/metadata-representation.decorator';

export const DEFAULT_ITEM_TYPE = 'Default';
export const DEFAULT_VIEW_MODE = ViewMode.ListElement;


const listElementMap = new Map();

/**
 * Decorator used for rendering simple item pages by type and viewMode (and optionally a representationType)
 * @param type
 * @param viewMode
 */
export function listableObjectComponent(objectType: string, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT) {
  return function decorator(component: any) {
    if (hasNoValue(objectType)) {
      return;
    }
    if (hasNoValue(listElementMap.get(objectType))) {
      listElementMap.set(objectType, new Map());
    }
    if (hasNoValue(listElementMap.get(objectType).get(viewMode))) {
      listElementMap.get(objectType).set(viewMode, new Map());
    }
    listElementMap.get(objectType).get(viewMode).set(context, component);
  };
}


export function getListableObjectComponent(entityType: GenericConstructor<ListableObject> | string, viewMode: ViewMode, context: Context = DEFAULT_CONTEXT) {
  const mapForType = listElementMap.get(entityType);
  if (hasValue(mapForType)) {
    const typeAndMDRepMap = mapForType.get(viewMode);
    if (hasValue(typeAndMDRepMap)) {
      if (hasValue(typeAndMDRepMap.get(context))) {
        return typeAndMDRepMap.get(context);
      }
      if (hasValue(typeAndMDRepMap.get(DEFAULT_CONTEXT))) {
        return typeAndMDRepMap.get(DEFAULT_CONTEXT);
      }
    }
    return mapForType.get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT);
  }
  return listElementMap.get(DEFAULT_ITEM_TYPE).get(DEFAULT_VIEW_MODE).get(DEFAULT_CONTEXT);
}