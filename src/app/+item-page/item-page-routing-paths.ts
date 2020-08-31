import { URLCombiner } from '../core/url-combiner/url-combiner';

export const ITEM_MODULE_PATH = 'items';

export function getItemModuleRoute() {
  return `/${ITEM_MODULE_PATH}`;
}

export function getItemPageRoute(itemId: string) {
  return new URLCombiner(getItemModuleRoute(), itemId).toString();
}

export function getItemEditRoute(id: string) {
  return new URLCombiner(getItemModuleRoute(), id, ITEM_EDIT_PATH).toString()
}

export const ITEM_EDIT_PATH = 'edit';
export const UPLOAD_BITSTREAM_PATH = 'bitstreams/new';
