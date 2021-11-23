import { DEFAULT_LAYOUT_PAGE, LayoutPage } from '../enums/layout-page.enum';
import { DEFAULT_LAYOUT_TAB, LayoutTab } from '../enums/layout-tab.enum';
import { LayoutBox } from '../enums/layout-box.enum';
import { hasNoValue } from '../../shared/empty.util';
import { Item } from '../../core/shared/item.model';

const layoutBoxesMap = new Map();
const ITEM_METADATA_TYPE = 'dspace.entity.type';

export function CrisLayoutBox(boxType: LayoutBox,hasOwnLayout = false) {
  return function decorator(component: any) {
    if (hasNoValue(boxType)) {
      return;
    }
    if (hasNoValue(layoutBoxesMap.get(boxType))) {
      layoutBoxesMap.set(boxType, {
        componentRef: component,
        hasOwnLayout: hasOwnLayout
      });
    }
  };
}

export function getCrisLayoutBox(boxType: LayoutBox) {
  return layoutBoxesMap.get(boxType);
}
