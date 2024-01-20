import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getTabulatableObjectsComponent, tabulatableObjectsComponent } from './tabulatable-objects.decorator';
import { Context } from '../../../../core/shared/context.model';
import { PaginatedList } from '../../../../core/data/paginated-list.model';

const type = 'TestType';

@tabulatableObjectsComponent(PaginatedList<any>, ViewMode.Table, Context.Search)
class TestTable {
}
describe('TabulatableObject decorator function', () => {

  it('should have a decorator for table', () => {
    const tableDecorator = tabulatableObjectsComponent('Item', ViewMode.Table);
    expect(tableDecorator.length).not.toBeNull();
  });


  it('should return the matching class', () => {
    const component = getTabulatableObjectsComponent([type], ViewMode.Table, Context.Search);
    expect(component).toEqual(TestTable);
  });
});
