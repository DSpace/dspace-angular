  /* eslint-disable max-classes-per-file */
import { Item } from '../../../../core/shared/item.model';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { getListableObjectComponent, listableObjectComponent } from './listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';
import { environment } from '../../../../../environments/environment';

let ogEnvironmentThemes;

describe('ListableObject decorator function', () => {
  const type1 = 'TestType';
  const type2 = 'TestType2';
  const type3 = 'TestType3';
  const typeAncestor = 'TestTypeAncestor';
  const typeUnthemed = 'TestTypeUnthemed';

  class Test1List {
  }

  class Test1Grid {
  }

  class Test2List {
  }

  class Test2ListSubmission {
  }

  class Test3List {
  }

  class Test3DetailedSubmission {
  }

  class TestAncestorComponent {
  }

  class TestUnthemedComponent {
  }

  /* eslint-enable max-classes-per-file */

  beforeEach(() => {
    listableObjectComponent(type1, ViewMode.ListElement)(Test1List);
    listableObjectComponent(type1, ViewMode.GridElement)(Test1Grid);

    listableObjectComponent(type2, ViewMode.ListElement)(Test2List);
    listableObjectComponent(type2, ViewMode.ListElement, Context.Workspace)(Test2ListSubmission);

    listableObjectComponent(type3, ViewMode.ListElement)(Test3List);
    listableObjectComponent(type3, ViewMode.DetailedListElement, Context.Workspace)(Test3DetailedSubmission);

    // Register a metadata representation in the 'ancestor' theme
    listableObjectComponent(typeAncestor, ViewMode.ListElement, Context.Any, 'ancestor')(TestAncestorComponent);
    listableObjectComponent(typeUnthemed, ViewMode.ListElement, Context.Any)(TestUnthemedComponent);

    ogEnvironmentThemes = environment.themes;
  });

  afterEach(() => {
    environment.themes = ogEnvironmentThemes;
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

  describe('With theme extensions', () => {
    // We're only interested in the cases that the requested theme doesn't match the requested objectType,
    // as the cases where it does are already covered by the tests above
    describe('If requested theme has no match', () => {
      beforeEach(() => {
        environment.themes = [
          {
            name: 'requested',        // Doesn't match any objectType
            extends: 'intermediate',
          },
          {
            name: 'intermediate',     // Doesn't match any objectType
            extends: 'ancestor',
          },
          {
            name: 'ancestor',         // Matches typeAncestor, but not typeUnthemed
          }
        ];
      });

      it('should return component from the first ancestor theme that matches its objectType', () => {
        const component = getListableObjectComponent([typeAncestor], ViewMode.ListElement, Context.Any, 'requested');
        expect(component).toEqual(TestAncestorComponent);
      });

      it('should return default component if none of the ancestor themes match its objectType', () => {
        const component = getListableObjectComponent([typeUnthemed], ViewMode.ListElement, Context.Any, 'requested');
        expect(component).toEqual(TestUnthemedComponent);
      });
    });

    describe('If there is a theme extension cycle', () => {
      beforeEach(() => {
        environment.themes = [
          { name: 'extension-cycle', extends: 'broken1' },
          { name: 'broken1', extends: 'broken2' },
          { name: 'broken2', extends: 'broken3' },
          { name: 'broken3', extends: 'broken1' },
        ];
      });

      it('should throw an error', () => {
        expect(() => {
          getListableObjectComponent([typeAncestor], ViewMode.ListElement, Context.Any, 'extension-cycle');
        }).toThrowError(
          'Theme extension cycle detected: extension-cycle -> broken1 -> broken2 -> broken3 -> broken1'
        );
      });
    });
  });
});
