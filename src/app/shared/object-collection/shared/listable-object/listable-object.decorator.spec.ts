import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getListableObjectComponent, listableObjectComponent } from './listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';

describe('ListableObject decorator function', () => {
  const type1 = 'TestType';
  const type2 = 'TestType2';
  const type3 = 'TestType3';

  /* tslint:disable:max-classes-per-file */
  class Test1List {};
  class Test1Grid {};
  class Test2List {};
  class Test2ListSubmission {};
  class Test3List {};
  class Test3DetailedSubmission {};
  /* tslint:enable:max-classes-per-file */

  beforeEach(() => {
    listableObjectComponent(type1, ViewMode.ListElement)(Test1List);
    listableObjectComponent(type1, ViewMode.GridElement)(Test1Grid);

    listableObjectComponent(type2, ViewMode.ListElement)(Test2List);
    listableObjectComponent(type2, ViewMode.ListElement, Context.Workspace)(Test2ListSubmission);

    listableObjectComponent(type3, ViewMode.ListElement)(Test3List);
    listableObjectComponent(type3, ViewMode.DetailedListElement, Context.Workspace)(Test3DetailedSubmission);
  });

  const gridDecorator = listableObjectComponent('Item', ViewMode.GridElement);
  const listDecorator = listableObjectComponent('Item', ViewMode.ListElement);
  it('should have a decorator for both list and grid', () => {
    expect(listDecorator.length).not.toBeNull();
    expect(gridDecorator.length).not.toBeNull();
  });
  it('should have 2 separate decorators for grid and list', () => {
    expect(listDecorator).not.toEqual(gridDecorator);
  });

  describe('If there\'s an exact match', () => {
    it('should return the matching class', () => {
      const component = getListableObjectComponent([type3], ViewMode.DetailedListElement, Context.Workspace);
      expect(component).toEqual(Test3DetailedSubmission);

      const component2 = getListableObjectComponent([type3, type2], ViewMode.ListElement, Context.Workspace);
      expect(component2).toEqual(Test2ListSubmission);
    });
  });

  describe('If there isn\'nt an exact match', () => {
    describe('If there is a match for one of the entity types and the view mode', () => {
      it('should return the class with the matching entity type and view mode and default context', () => {
        const component = getListableObjectComponent([type3], ViewMode.ListElement, Context.Workspace);
        expect(component).toEqual(Test3List);

        const component2 = getListableObjectComponent([type3, type1], ViewMode.GridElement, Context.Workspace);
        expect(component2).toEqual(Test1Grid);
      });
    });
    describe('If there isn\'t a match for the representation type', () => {
      it('should return the class with the matching entity type and the default view mode and default context', () => {
        const component = getListableObjectComponent([type1], ViewMode.DetailedListElement);
        expect(component).toEqual(Test1List);

        const component2 = getListableObjectComponent([type2, type1], ViewMode.DetailedListElement);
        expect(component2).toEqual(Test2List);
      });
    });
  });
});
