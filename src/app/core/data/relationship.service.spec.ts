import { RelationshipService } from './relationship.service';
import { RequestService } from './request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { getMockRemoteDataBuildService } from '../../shared/mocks/mock-remote-data-build.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RequestEntry } from './request.reducer';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { ResourceType } from '../shared/resource-type';
import { Relationship } from '../shared/item-relationships/relationship.model';
import { RemoteData } from './remote-data';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { Item } from '../shared/item.model';
import { PaginatedList } from './paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { DeleteRequest } from './request.models';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Observable } from 'rxjs/internal/Observable';

describe('RelationshipService', () => {
  let service: RelationshipService;
  let requestService: RequestService;

  const restEndpointURL = 'https://rest.api/';
  const relationshipsEndpointURL = `${restEndpointURL}/relationships`;
  const halService: any = new HALEndpointServiceStub(restEndpointURL);
  const rdbService = getMockRemoteDataBuildService();
  const objectCache = Object.assign({
    /* tslint:disable:no-empty */
    remove: () => {}
    /* tslint:enable:no-empty */
  }) as ObjectCacheService;

  const relationshipType = Object.assign(new RelationshipType(), {
    type: ResourceType.RelationshipType,
    id: '1',
    uuid: '1',
    leftLabel: 'isAuthorOfPublication',
    rightLabel: 'isPublicationOfAuthor'
  });

  const relationship1 = Object.assign(new Relationship(), {
    self: relationshipsEndpointURL + '/2',
    id: '2',
    uuid: '2',
    relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
  });
  const relationship2 = Object.assign(new Relationship(), {
    self: relationshipsEndpointURL + '/3',
    id: '3',
    uuid: '3',
    relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
  });

  const relationships = [ relationship1, relationship2 ];

  const item = Object.assign(new Item(), {
    self: 'fake-item-url/publication',
    id: 'publication',
    uuid: 'publication',
    relationships: observableOf(new RemoteData(false, false, true, undefined, new PaginatedList(new PageInfo(), relationships)))
  });

  const relatedItem1 = Object.assign(new Item(), {
    id: 'author1',
    uuid: 'author1'
  });
  const relatedItem2 = Object.assign(new Item(), {
    id: 'author2',
    uuid: 'author2'
  });
  relationship1.leftItem = getRemotedataObservable(relatedItem1);
  relationship1.rightItem = getRemotedataObservable(item);
  relationship2.leftItem = getRemotedataObservable(relatedItem2);
  relationship2.rightItem = getRemotedataObservable(item);
  const relatedItems = [relatedItem1, relatedItem2];

  const itemService = jasmine.createSpyObj('itemService', {
    findById: (uuid) => new RemoteData(false, false, true, undefined, relatedItems.filter((relatedItem) => relatedItem.id === uuid)[0])
  });

  function initTestService() {
    return new RelationshipService(
      requestService,
      halService,
      rdbService,
      itemService,
      objectCache
    );
  }

  const getRequestEntry$ = (successful: boolean) => {
    return observableOf({
      response: { isSuccessful: successful, payload: relationships } as any
    } as RequestEntry)
  };

  beforeEach(() => {
    requestService = getMockRequestService(getRequestEntry$(true));
    service = initTestService();
  });

  describe('deleteRelationship', () => {
    beforeEach(() => {
      spyOn(service, 'findById').and.returnValue(getRemotedataObservable(relationship1));
      spyOn(objectCache, 'remove');
      service.deleteRelationship(relationships[0].uuid).subscribe();
    });

    it('should send a DeleteRequest', () => {
      const expected = new DeleteRequest(requestService.generateRequestId(), relationshipsEndpointURL + '/' + relationship1.uuid);
      expect(requestService.configure).toHaveBeenCalledWith(expected, undefined);
    });

    it('should clear the related items their cache', () => {
      expect(objectCache.remove).toHaveBeenCalledWith(relatedItem1.self);
      expect(objectCache.remove).toHaveBeenCalledWith(item.self);
      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(relatedItem1.self);
      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(item.self);
    });
  });

  describe('getItemRelationshipsArray', () => {
    it('should return the item\'s relationships in the form of an array', () => {
      service.getItemRelationshipsArray(item).subscribe((result) => {
        expect(result).toEqual(relationships);
      });
    });
  });

  describe('getItemRelationshipLabels', () => {
    it('should return the correct labels', () => {
      service.getItemRelationshipLabels(item).subscribe((result) => {
        expect(result).toEqual([relationshipType.rightLabel]);
      });
    });
  });

  describe('getRelatedItems', () => {
    it('should return the related items', () => {
      service.getRelatedItems(item).subscribe((result) => {
        expect(result).toEqual(relatedItems);
      });
    });
  });

  describe('getRelatedItemsByLabel', () => {
    it('should return the related items by label', () => {
      service.getRelatedItemsByLabel(item, relationshipType.rightLabel).subscribe((result) => {
        expect(result).toEqual(relatedItems);
      });
    });
  })

});

function getRemotedataObservable(obj: any): Observable<RemoteData<any>> {
  return observableOf(new RemoteData(false, false, true, undefined, obj));
}
