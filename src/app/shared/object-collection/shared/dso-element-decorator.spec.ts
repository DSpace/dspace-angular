import { renderElementsFor } from './dso-element-decorator';
import { Item } from '../../../core/shared/item.model';
import { ViewMode } from '../../../core/shared/view-mode.model';

describe('ElementDecorator', () => {
  const gridDecorator = renderElementsFor(Item, ViewMode.Grid);
  const listDecorator = renderElementsFor(Item, ViewMode.List);
  it('should have a decorator for both list and grid', () => {
    expect(listDecorator.length).not.toBeNull();
    expect(gridDecorator.length).not.toBeNull();
  });
  it('should have 2 separate decorators for grid and list', () => {
    expect(listDecorator).not.toEqual(gridDecorator);
  });

});
