import { of as observableOf } from 'rxjs';
import { getMockRemoteDataBuildService } from '../../shared/mocks/mock-remote-data-build.service';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { PageInfo } from '../shared/page-info.model';
import { PaginatedList } from './paginated-list';
import { RelationshipTypeService } from './relationship-type.service';
import { RequestService } from './request.service';

describe('RelationshipTypeService', () => {
  let service: RelationshipTypeService;
  let requestService: RequestService;
  let restEndpointURL;
  let halService: any;
  let publicationTypeString;
  let personTypeString;
  let orgUnitTypeString;
  let publicationType;
  let personType;
  let orgUnitType;

  let relationshipType1;
  let relationshipType2;

  let itemService;
  let buildList;
  let rdbService;
  let objectCache;

  function init() {
    restEndpointURL = 'https://rest.api/relationshiptypes';
    halService = new HALEndpointServiceStub(restEndpointURL);
    publicationTypeString = 'Publication';
    personTypeString = 'Person';
    orgUnitTypeString = 'OrgUnit';
    publicationType = Object.assign(new ItemType(), {label: publicationTypeString});
    personType = Object.assign(new ItemType(), {label: personTypeString});
    orgUnitType = Object.assign(new ItemType(), {label: orgUnitTypeString});

    relationshipType1 = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor',
      leftType: createSuccessfulRemoteDataObject$(publicationType),
      rightType: createSuccessfulRemoteDataObject$(personType)
    });

    relationshipType2 = Object.assign(new RelationshipType(), {
      id: '2',
      uuid: '2',
      leftwardType: 'isOrgUnitOfPublication',
      rightwardType: 'isPublicationOfOrgUnit',
      leftType: createSuccessfulRemoteDataObject$(publicationType),
      rightType: createSuccessfulRemoteDataObject$(orgUnitType)
    });

    buildList = createSuccessfulRemoteDataObject(new PaginatedList(new PageInfo(), [relationshipType1, relationshipType2]));
    rdbService = getMockRemoteDataBuildService(undefined, observableOf(buildList));
    objectCache = Object.assign({
      /* tslint:disable:no-empty */
      remove: () => {
      },
      hasBySelfLinkObservable: () => observableOf(false)
      /* tslint:enable:no-empty */
    }) as ObjectCacheService;

    itemService = undefined;

  }
  function initTestService() {
    return new RelationshipTypeService(
      itemService,
      requestService,
      rdbService,
      null,
      halService,
      objectCache,
      null,
      null,
      null,
      null
    );
  }

  beforeEach(() => {
    init();
    requestService = getMockRequestService();
    service = initTestService();
  });

  describe('getAllRelationshipTypes', () => {

    it('should return all relationshipTypes', (done) => {
      const expected = service.getAllRelationshipTypes({});
      expected.subscribe((e) => {
        expect(e).toBe(buildList);
        done();
      })
    });
  });

  describe('getRelationshipTypeByLabelAndTypes', () => {

    it('should return the type filtered by label and type strings', (done) => {
      const expected = service.getRelationshipTypeByLabelAndTypes(relationshipType1.leftwardType, publicationTypeString, personTypeString);
      expected.subscribe((e) => {
        expect(e).toBe(relationshipType1);
        done();
      })
    });
  });

});
