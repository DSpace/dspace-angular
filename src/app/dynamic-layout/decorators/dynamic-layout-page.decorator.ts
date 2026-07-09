import { hasNoValue } from '@dspace/shared/utils/empty.util';

import { GenericConstructor } from '../../core/shared/generic-constructor';
import { DynamicLayoutHorizontalComponent } from '../dynamic-layout-loader/dynamic-layout-horizontal/dynamic-layout-horizontal.component';
import { DynamicLayoutVerticalComponent } from '../dynamic-layout-loader/dynamic-layout-vertical/dynamic-layout-vertical.component';
import {
  DEFAULT_LAYOUT_PAGE,
  LayoutPage,
} from '../enums/layout-page.enum';

const layoutPageMap = new Map<LayoutPage, GenericConstructor<DynamicLayoutHorizontalComponent|DynamicLayoutVerticalComponent>>([
  [ LayoutPage.HORIZONTAL, DynamicLayoutHorizontalComponent ],
  [ LayoutPage.VERTICAL, DynamicLayoutVerticalComponent ],
]);

layoutPageMap.set(LayoutPage.HORIZONTAL, DynamicLayoutHorizontalComponent);
layoutPageMap.set(LayoutPage.VERTICAL, DynamicLayoutVerticalComponent);

export function getDynamicLayoutPage(orientation: LayoutPage): any {
  let componentLayout;
  if (hasNoValue(orientation) || hasNoValue(layoutPageMap.get(orientation))) {
    componentLayout = layoutPageMap.get(DEFAULT_LAYOUT_PAGE);
  } else {
    componentLayout = layoutPageMap.get(orientation);
  }
  return componentLayout;
}
