import { Item } from '../../core/shared/item.model';
import { hasNoValue } from '../../shared/empty.util';
import { DEFAULT_LAYOUT_PAGE, LayoutPage } from '../enums/layout-page.enum';

const layoutPageMap = new Map();
const ITEM_METADATA_TYPE = 'dspace.entity.type';

export function CrisLayoutPage(objectType: LayoutPage) {
  return function decorator(component: any) {
    if (hasNoValue(objectType)) {
      return;
    }
    if (hasNoValue(layoutPageMap.get(objectType))) {
      layoutPageMap.set(objectType, component);
    }
  };
}

export function getCrisLayoutPage(item: Item): any {
  let componentLayout;
  const objectType = item.firstMetadataValue(ITEM_METADATA_TYPE);
  if (hasNoValue(objectType) || hasNoValue(layoutPageMap.get(objectType))) {
    componentLayout = layoutPageMap.get(DEFAULT_LAYOUT_PAGE);
  } else {
    componentLayout = layoutPageMap.get(objectType);
  }
  return componentLayout;
}
