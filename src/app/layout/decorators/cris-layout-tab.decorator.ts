import { LayoutPage } from '../enums/layout-page.enum';
import { LayoutTab } from '../enums/layout-tab.enum';
import { hasNoValue } from 'src/app/shared/empty.util';
import { Item } from 'src/app/core/shared/item.model';

const layoutTabsMap = new Map();
const ITEM_METADATA_TYPE = 'relationship.type';

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
  }
}

export function getCrisLayoutTab(item: Item, tabName: LayoutTab | string): any {
  let componentLayout;
  const objectType = item.firstMetadataValue(ITEM_METADATA_TYPE);
  if (
    hasNoValue(objectType) ||
    hasNoValue(tabName) ||
    hasNoValue(layoutTabsMap.get(objectType)) ||
    hasNoValue(layoutTabsMap.get(objectType).get(tabName))) {
    componentLayout = layoutTabsMap.get(LayoutPage.DEFAULT).get(LayoutTab.DEFAULT);
  } else {
    componentLayout = layoutTabsMap.get(objectType).get(tabName);
  }
  return componentLayout;
}
