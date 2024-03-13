import { Context } from '../../../../core/shared/context.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getTabulatableObjectsComponent } from './tabulatable-objects.decorator';

const type = 'TestType';

class TestTable {
}
describe('TabulatableObject decorator function', () => {

  it('should have a decorator for table', () => {
    const tableDecorator = getTabulatableObjectsComponent(['Item'], ViewMode.Table);
    expect(tableDecorator.length).not.toBeNull();
  });


  it('should return the matching class', () => {
    const component = getTabulatableObjectsComponent([type], ViewMode.Table, Context.Search);
    expect(component).toEqual(TestTable);
  });
});
