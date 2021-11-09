import { Item } from '../../core/shared/item.model';
import { hasNoValue } from '../../shared/empty.util';
import { DEFAULT_LAYOUT_PAGE, LayoutPage } from '../enums/layout-page.enum';

const layoutPageMap = new Map();

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

export function getCrisLayoutPage(orientation: string): any {
  let componentLayout;
  if (hasNoValue(orientation) || hasNoValue(layoutPageMap.get(orientation))) {
    componentLayout = layoutPageMap.get(DEFAULT_LAYOUT_PAGE);
  } else {
    componentLayout = layoutPageMap.get(orientation);
  }
  return componentLayout;
}
