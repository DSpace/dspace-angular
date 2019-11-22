import { DEFAULT_ENTITY_TYPE, DEFAULT_REPRESENTATION_TYPE, getMetadataRepresentationComponent, metadataRepresentationComponent } from './metadata-representation.decorator';
import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import { Context } from '../../core/shared/context.model';
import * as uuidv4 from 'uuid/v4';

describe('MetadataRepresentation decorator function', () => {
  const type1 = 'TestType';
  const type2 = 'TestType2';
  const type3 = 'TestType3';
  const type4 = 'RandomType';
  let prefix;
  /* tslint:disable:max-classes-per-file */
  class Test1PlainText {};
  class Test1Authority {};
  class Test2Item {};
  class Test2ItemSubmission {};
  class Test3ItemSubmission {};
  /* tslint:enable:max-classes-per-file */

  beforeEach(() => {
    prefix = uuidv4();
    init(prefix);
  });

  function init(key) {
    metadataRepresentationComponent(key + type1, MetadataRepresentationType.PlainText)(Test1PlainText);
    metadataRepresentationComponent(key + type1, MetadataRepresentationType.AuthorityControlled)(Test1Authority);

    metadataRepresentationComponent(key + type2, MetadataRepresentationType.Item)(Test2Item);
    metadataRepresentationComponent(key + type2, MetadataRepresentationType.Item, Context.Workspace)(Test2ItemSubmission);

    metadataRepresentationComponent(key + type3, MetadataRepresentationType.Item, Context.Workspace)(Test3ItemSubmission);
  }

  describe('If there\'s an exact match', () => {
    it('should return the matching class', () => {
      const component = getMetadataRepresentationComponent(prefix + type3, MetadataRepresentationType.Item, Context.Workspace);
      expect(component).toEqual(Test3ItemSubmission);
    });
  });

  describe('If there isn\'nt an exact match', () => {
    describe('If there is a match for the entity type and representation type', () => {
      it('should return the class with the matching entity type and representation type and default context', () => {
        const component = getMetadataRepresentationComponent(prefix + type1, MetadataRepresentationType.AuthorityControlled, Context.Workspace);
        expect(component).toEqual(Test1Authority);
      });
    });
    describe('If there isn\'t a match for the representation type', () => {
      it('should return the class with the matching entity type and the default representation type and default context', () => {
        const component = getMetadataRepresentationComponent(prefix + type1, MetadataRepresentationType.Item);
        expect(component).toEqual(Test1PlainText);
      });
      describe('If there isn\'t a match for the entity type', () => {
        it('should return the class with the default entity type and the default representation type and default context', () => {
          const defaultComponent = getMetadataRepresentationComponent(DEFAULT_ENTITY_TYPE, DEFAULT_REPRESENTATION_TYPE);
          const component = getMetadataRepresentationComponent(prefix + type4, MetadataRepresentationType.AuthorityControlled);
          expect(component).toEqual(defaultComponent);
        });
      });
    });
  });
});
