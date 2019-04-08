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

describe('RelationshipService', () => {
  let service: RelationshipService;
  let requestService: RequestService;

  const restEndpointURL = 'https://rest.api/';
  const relationshipsEndpointURL = `${restEndpointURL}/relationships`;
  const halService: any = new HALEndpointServiceStub(restEndpointURL);
  const rdbService = getMockRemoteDataBuildService();

  const relationshipType = Object.assign(new RelationshipType(), {
    type: ResourceType.RelationshipType,
    id: '1',
    uuid: '1',
    leftLabel: 'isAuthorOfPublication',
    rightLabel: 'isPublicationOfAuthor'
  });

  const relationships = [
    Object.assign(new Relationship(), {
      self: relationshipsEndpointURL + '/2',
      id: '2',
      uuid: '2',
      leftId: 'author1',
      rightId: 'publication',
      relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
    }),
    Object.assign(new Relationship(), {
      self: relationshipsEndpointURL + '/3',
      id: '3',
      uuid: '3',
      leftId: 'author2',
      rightId: 'publication',
      relationshipType: observableOf(new RemoteData(false, false, true, undefined, relationshipType))
    })
  ];

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
  const relatedItems = [relatedItem1, relatedItem2];

  const itemService = jasmine.createSpyObj('itemService', {
    findById: (uuid) => new RemoteData(false, false, true, undefined, relatedItems.filter((relatedItem) => relatedItem.id === uuid)[0])
  });

  function initTestService() {
    return new RelationshipService(
      requestService,
      halService,
      rdbService,
      itemService
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
      service.deleteRelationship(relationships[0].uuid).subscribe();
    });

    it('should send a DeleteRequest', () => {
      const expected = new DeleteRequest(requestService.generateRequestId(), relationshipsEndpointURL + '/' + relationships[0].uuid);
      expect(requestService.configure).toHaveBeenCalledWith(expected, undefined);
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
