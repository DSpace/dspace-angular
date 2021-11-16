import { DEFAULT_LAYOUT_PAGE, LayoutPage } from '../enums/layout-page.enum';
import { DEFAULT_LAYOUT_TAB, LayoutTab } from '../enums/layout-tab.enum';
import { hasNoValue } from '../../shared/empty.util';
import { Item } from '../../core/shared/item.model';

const layoutTabsMap = new Map();
const ITEM_METADATA_TYPE = 'dspace.entity.type';

export function CrisLayoutTab(objectType: LayoutPage, tabName: LayoutTab) {
  return function decorator(component: any) {
    if (hasNoValue(objectType) || hasNoValue(tabName)) {
      return;
    }
    if (hasNoValue(layoutTabsMap.get(objectType))) {
      layoutTabsMap.set(objectType, new Map());
    }
    if (hasNoValue(layoutTabsMap.get(objectType).get(tabName))) {
      layoutTabsMap.get(objectType).set(tabName, component);
    }
  };
}

export function getCrisLayoutTab(item: Item, tabName: LayoutTab | string): any {
  let componentLayout;
  const objectType = item.firstMetadataValue(ITEM_METADATA_TYPE);
  if (
    hasNoValue(objectType) ||
    hasNoValue(tabName) ||
    hasNoValue(layoutTabsMap.get(objectType)) ||
    hasNoValue(layoutTabsMap.get(objectType).get(tabName))) {
    componentLayout = layoutTabsMap.get(DEFAULT_LAYOUT_PAGE).get(DEFAULT_LAYOUT_TAB);
  } else {
    componentLayout = layoutTabsMap.get(objectType).get(tabName);
  }
  return componentLayout;
}
