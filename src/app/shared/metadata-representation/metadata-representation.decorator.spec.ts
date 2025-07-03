/* eslint-disable max-classes-per-file */
import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import { environment } from '../../../environments/environment';
import { Context } from '../../core/shared/context.model';
import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
import {
  DEFAULT_CONTEXT,
  DEFAULT_THEME,
} from '../object-collection/shared/listable-object/listable-object.decorator';
import {
  DEFAULT_ENTITY_TYPE,
  DEFAULT_REPRESENTATION_TYPE,
  getMetadataRepresentationComponent,
} from './metadata-representation.decorator';

let ogEnvironmentThemes;

describe('MetadataRepresentation decorator function', () => {
  const type1 = 'TestType';
  const type2 = 'TestType2';
  const type3 = 'TestType3';
  const type4 = 'RandomType';
  const typeAncestor = 'TestTypeAncestor';
  const typeUnthemed = 'TestTypeUnthemed';
  let prefix;

  class Test1PlainText {
  }

  class Test1Authority {
  }

  class Test2Item {
  }

  class Test2ItemSubmission {
  }

  class Test3ItemSubmission {
  }

  class TestAncestorComponent {
  }

  class TestUnthemedComponent {
  }

  let metadataRepresentationComponentRegistry: Map<string, Map<MetadataRepresentationType, Map<Context, Map<string, () => Promise<Component>>>>>;

  /* eslint-enable max-classes-per-file */

  beforeEach(() => {
    prefix = uuidv4();
    init(prefix);
  });

  function init(key) {
    metadataRepresentationComponentRegistry = new Map();

    metadataRepresentationComponentRegistry.set(key + type1, new Map());
    metadataRepresentationComponentRegistry.get(key + type1).set(MetadataRepresentationType.PlainText, new Map());
    metadataRepresentationComponentRegistry.get(key + type1).get(MetadataRepresentationType.PlainText).set(DEFAULT_CONTEXT, new Map());
    metadataRepresentationComponentRegistry.get(key + type1).get(MetadataRepresentationType.PlainText).get(DEFAULT_CONTEXT).set(DEFAULT_THEME, () => Promise.resolve(Test1PlainText as any));
    metadataRepresentationComponentRegistry.get(key + type1).set(MetadataRepresentationType.AuthorityControlled, new Map());
    metadataRepresentationComponentRegistry.get(key + type1).get(MetadataRepresentationType.AuthorityControlled).set(DEFAULT_CONTEXT, new Map());
    metadataRepresentationComponentRegistry.get(key + type1).get(MetadataRepresentationType.AuthorityControlled).get(DEFAULT_CONTEXT).set(DEFAULT_THEME, () => Promise.resolve(Test1Authority as any));

    metadataRepresentationComponentRegistry.set(key + type2, new Map());
    metadataRepresentationComponentRegistry.get(key + type2).set(MetadataRepresentationType.Item, new Map());
    metadataRepresentationComponentRegistry.get(key + type2).get(MetadataRepresentationType.Item).set(DEFAULT_CONTEXT, new Map());
    metadataRepresentationComponentRegistry.get(key + type2).get(MetadataRepresentationType.Item).get(DEFAULT_CONTEXT).set(DEFAULT_THEME, () => Promise.resolve(Test2Item as any));
    metadataRepresentationComponentRegistry.get(key + type2).get(MetadataRepresentationType.Item).set(Context.Workspace, new Map());
    metadataRepresentationComponentRegistry.get(key + type2).get(MetadataRepresentationType.Item).get(Context.Workspace).set(DEFAULT_THEME, () => Promise.resolve(Test2ItemSubmission as any));

    metadataRepresentationComponentRegistry.set(key + type3, new Map());
    metadataRepresentationComponentRegistry.get(key + type3).set(MetadataRepresentationType.Item, new Map());
    metadataRepresentationComponentRegistry.get(key + type3).get(MetadataRepresentationType.Item).set(Context.Workspace, new Map());
    metadataRepresentationComponentRegistry.get(key + type3).get(MetadataRepresentationType.Item).get(Context.Workspace).set(DEFAULT_THEME, () => Promise.resolve(Test3ItemSubmission as any));

    // Register a metadata representation in the 'ancestor' theme
    metadataRepresentationComponentRegistry.set(key + typeAncestor, new Map());
    metadataRepresentationComponentRegistry.get(key + typeAncestor).set(MetadataRepresentationType.Item, new Map());
    metadataRepresentationComponentRegistry.get(key + typeAncestor).get(MetadataRepresentationType.Item).set(Context.Any, new Map());
    metadataRepresentationComponentRegistry.get(key + typeAncestor).get(MetadataRepresentationType.Item).get(Context.Any).set('ancestor', () => Promise.resolve(TestAncestorComponent as any));
    metadataRepresentationComponentRegistry.set(key + typeUnthemed, new Map());
    metadataRepresentationComponentRegistry.get(key + typeUnthemed).set(MetadataRepresentationType.Item, new Map());
    metadataRepresentationComponentRegistry.get(key + typeUnthemed).get(MetadataRepresentationType.Item).set(Context.Any, new Map());
    metadataRepresentationComponentRegistry.get(key + typeUnthemed).get(MetadataRepresentationType.Item).get(Context.Any).set(DEFAULT_THEME, () => Promise.resolve(TestUnthemedComponent as any));

    ogEnvironmentThemes = environment.themes;
  }

  afterEach(() => {
    environment.themes = ogEnvironmentThemes;
  });

  describe('If there\'s an exact match', () => {
    it('should return the matching class', async () => {
      const component = await getMetadataRepresentationComponent(prefix + type3, MetadataRepresentationType.Item, Context.Workspace, undefined, metadataRepresentationComponentRegistry);
      expect(component).toEqual(Test3ItemSubmission);
    });
  });

  describe('If there isn\'t an exact match', () => {
    describe('If there is a match for the entity type and representation type', () => {
      it('should return the class with the matching entity type and representation type and default context', async () => {
        const component = await getMetadataRepresentationComponent(prefix + type1, MetadataRepresentationType.AuthorityControlled, Context.Workspace, undefined, metadataRepresentationComponentRegistry);
        expect(component).toEqual(Test1Authority);
      });
    });
    describe('If there isn\'t a match for the representation type', () => {
      it('should return the class with the matching entity type and the default representation type and default context', async () => {
        const component = await getMetadataRepresentationComponent(prefix + type1, MetadataRepresentationType.Item, undefined, undefined, metadataRepresentationComponentRegistry);
        expect(component).toEqual(Test1PlainText);
      });
      describe('If there isn\'t a match for the entity type', () => {
        it('should return the class with the default entity type and the default representation type and default context', async () => {
          const defaultComponent = await getMetadataRepresentationComponent(DEFAULT_ENTITY_TYPE, DEFAULT_REPRESENTATION_TYPE, undefined, undefined, metadataRepresentationComponentRegistry);
          const component = await getMetadataRepresentationComponent(prefix + type4, MetadataRepresentationType.AuthorityControlled, undefined, undefined, metadataRepresentationComponentRegistry);
          expect(component).toEqual(defaultComponent);
        });
      });
    });
  });

  describe('With theme extensions', () => {
    // We're only interested in the cases that the requested theme doesn't match the requested entityType,
    // as the cases where it does are already covered by the tests above
    describe('If requested theme has no match', () => {
      beforeEach(() => {
        environment.themes = [
          {
            name: 'requested',        // Doesn't match any entityType
            extends: 'intermediate',
          },
          {
            name: 'intermediate',     // Doesn't match any entityType
            extends: 'ancestor',
          },
          {
            name: 'ancestor',         // Matches typeAncestor, but not typeUnthemed
          },
        ];
      });

      it('should return component from the first ancestor theme that matches its entityType', async () => {
        const component = await getMetadataRepresentationComponent(prefix + typeAncestor, MetadataRepresentationType.Item, Context.Any, 'requested', metadataRepresentationComponentRegistry);
        expect(component).toEqual(TestAncestorComponent);
      });

      it('should return default component if none of the ancestor themes match its entityType', async () => {
        const component = await getMetadataRepresentationComponent(prefix + typeUnthemed, MetadataRepresentationType.Item, Context.Any, 'requested', metadataRepresentationComponentRegistry);
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
          getMetadataRepresentationComponent(prefix + typeAncestor, MetadataRepresentationType.Item, Context.Any, 'extension-cycle', metadataRepresentationComponentRegistry);
        }).toThrowError(
          'Theme extension cycle detected: extension-cycle -> broken1 -> broken2 -> broken3 -> broken1',
        );
      });
    });
  });
});
