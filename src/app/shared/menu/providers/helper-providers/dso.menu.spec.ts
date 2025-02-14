import { TestBed } from '@angular/core/testing';

import { Collection } from '../../../../core/shared/collection.model';
import { COLLECTION } from '../../../../core/shared/collection.resource-type';
import { Item } from '../../../../core/shared/item.model';
import { ITEM } from '../../../../core/shared/item.resource-type';
import { createSuccessfulRemoteDataObject } from '../../../remote-data.utils';
import { DSpaceObjectPageMenuProvider } from './dso.menu';

describe('DSpaceObjectPageMenuProvider', () => {

  let provider: DSpaceObjectPageMenuProvider;

  const item: Item = Object.assign(new Item(), {
    uuid: 'test-item-uuid',
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item',
      }],
    },
  });

  const item2: Item = Object.assign(new Item(), {
    uuid: 'test-item2-uuid',
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Untyped Item 2',
      }],
    },
  });

  const person: Item = Object.assign(new Item(), {
    uuid: 'test-uuid',
    type: ITEM.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Person Entity',
      }],
      'dspace.entity.type': [{
        'value': 'Person',
      }],
    },
  });

  const collection: Collection = Object.assign(new Collection(), {
    uuid: 'test-collection-uuid',
    type: COLLECTION.value,
    _links: { self: { href: 'self-link' } },
    metadata: {
      'dc.title': [{
        'value': 'Collection',
      }],
    },
  });


  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        DSpaceObjectPageMenuProvider,
      ],
    });
    provider = TestBed.inject(DSpaceObjectPageMenuProvider);
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getRouteContext', () => {
    it('should get the dso from the route', (done) => {
      const route = { data: { dso: createSuccessfulRemoteDataObject(item) } } as any;

      provider.getRouteContext(route, undefined).subscribe((dso) => {
        expect(dso).toEqual(item);
        done();
      });
    });

    it('return the first parent DSO when no DSO is present on the current route', (done) => {
      const route = {
        data: {},
        parent: {
          data: {},
          parent: {
            data: { dso: createSuccessfulRemoteDataObject(item) },
            parent: { data: { dso: createSuccessfulRemoteDataObject(item2) } },
          },
        },
      } as any;

      provider.getRouteContext(route, undefined).subscribe((dso) => {
        expect(dso).toEqual(item);
        done();
      });
    });
    it('should return undefined when no dso is found in the route', (done) => {
      const route = { data: {}, parent: { data: {}, parent: { data: {}, parent: { data: {} } } } } as any;

      provider.getRouteContext(route, undefined).subscribe((dso) => {
        expect(dso).toBeUndefined();
        done();
      });
    });
  });

  describe('getDsoType', () => {
    it('should return the object type for an untyped item', () => {
      const dsoType = (provider as any).getDsoType(item);
      expect(dsoType).toEqual('item');
    });
    it('should return the entity type for an entity item', () => {
      const dsoType = (provider as any).getDsoType(person);
      expect(dsoType).toEqual('person');
    });
    it('should return the object type for a colletion', () => {
      const dsoType = (provider as any).getDsoType(collection);
      expect(dsoType).toEqual('collection');
    });
  });

  describe('isApplicable', () => {
    it('should return true when a dso is provided', () => {
      const isApplicable = (provider as any).isApplicable(collection);
      expect(isApplicable).toBeTrue();
    });
    it('should return false when no dso is provided', () => {
      const isApplicable = (provider as any).isApplicable(undefined);
      expect(isApplicable).toBeFalse();
    });
  });

});
