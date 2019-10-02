import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from './listable-object.decorator';

describe('ElementDecorator', () => {
  const gridDecorator = listableObjectComponent(Item, ViewMode.GridElement);
  const listDecorator = listableObjectComponent(Item, ViewMode.ListElement);
  it('should have a decorator for both list and grid', () => {
    expect(listDecorator.length).not.toBeNull();
    expect(gridDecorator.length).not.toBeNull();
  });
  it('should have 2 separate decorators for grid and list', () => {
    expect(listDecorator).not.toEqual(gridDecorator);
  });

});
