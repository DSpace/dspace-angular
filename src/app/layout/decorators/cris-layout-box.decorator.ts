import { LayoutPage } from '../enums/layout-page.enum';
import { LayoutTab } from '../enums/layout-tab.enum';
import { LayoutBox } from '../enums/layout-box.enum';
import { hasNoValue } from 'src/app/shared/empty.util';
import { Item } from 'src/app/core/shared/item.model';

const layoutBoxesMap = new Map();
const ITEM_METADATA_TYPE = 'relationship.type';

export function CrisLayoutBox(objectType: LayoutPage, tabName: LayoutTab, boxType: LayoutBox) {
  return function decorator(component: any) {
    if (hasNoValue(objectType) || hasNoValue(tabName) || hasNoValue(boxType)) {
      return;
    }
    if (hasNoValue(layoutBoxesMap.get(objectType))) {
      layoutBoxesMap.set(objectType, new Map());
    }
    if (hasNoValue(layoutBoxesMap.get(objectType).get(tabName))) {
      layoutBoxesMap.get(objectType).set(tabName, new Map());
    }
    if (hasNoValue(layoutBoxesMap.get(objectType).get(tabName).get(boxType))) {
      layoutBoxesMap.get(objectType).get(tabName).set(boxType, component);
    }
  }
}

export function getCrisLayoutBox(item: Item, tabName: LayoutTab | string, boxType: LayoutBox | string) {
  const objectType = item.firstMetadataValue(ITEM_METADATA_TYPE);
  let currentMap;
  if (hasNoValue(objectType) || hasNoValue(layoutBoxesMap.get(objectType))) {
    currentMap = layoutBoxesMap.get(LayoutPage.DEFAULT);
  } else {
    currentMap = layoutBoxesMap.get(objectType);
  }
  if (hasNoValue(tabName) || hasNoValue(currentMap.get(tabName))) {
    currentMap = currentMap.get(LayoutTab.DEFAULT);
  } else {
    currentMap = currentMap.get(tabName);
  }
  return currentMap.get(boxType);
}
