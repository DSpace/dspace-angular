
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { hasNoValue } from '../../shared/empty.util';
import { CrisLayoutHorizontalComponent } from '../cris-layout-loader/cris-layout-horizontal/cris-layout-horizontal.component';
import { CrisLayoutVerticalComponent } from '../cris-layout-loader/cris-layout-vertical/cris-layout-vertical.component';
import {
  DEFAULT_LAYOUT_PAGE,
  LayoutPage,
} from '../enums/layout-page.enum';

const layoutPageMap = new Map<LayoutPage, GenericConstructor<CrisLayoutHorizontalComponent|CrisLayoutVerticalComponent>>([
  [ LayoutPage.HORIZONTAL, CrisLayoutHorizontalComponent ],
  [ LayoutPage.VERTICAL, CrisLayoutVerticalComponent ],
]);

layoutPageMap.set(LayoutPage.HORIZONTAL, CrisLayoutHorizontalComponent);
layoutPageMap.set(LayoutPage.VERTICAL, CrisLayoutVerticalComponent);

export function getCrisLayoutPage(orientation: LayoutPage): any {
  let componentLayout;
  if (hasNoValue(orientation) || hasNoValue(layoutPageMap.get(orientation))) {
    componentLayout = layoutPageMap.get(DEFAULT_LAYOUT_PAGE);
  } else {
    componentLayout = layoutPageMap.get(orientation);
  }
  return componentLayout;
}
