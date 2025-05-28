import { of } from 'rxjs';

import { hasValueOperator } from '../../shared/empty.util';
import { getMockRemoteDataBuildService } from '../../shared/mocks/remote-data-build.service.mock';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { ObjectCacheServiceStub } from '../../shared/testing/object-cache-service.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { ObjectCacheService } from '../cache/object-cache.service';
import { ItemType } from '../shared/item-relationships/item-type.model';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { RelationshipTypeDataService } from './relationship-type-data.service';
import { RequestService } from './request.service';

describe('RelationshipTypeDataService', () => {
  let service: RelationshipTypeDataService;
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

  let buildList;
  let rdbService;
  let objectCache: ObjectCacheServiceStub;

  function init() {
    restEndpointURL = 'https://rest.api/relationshiptypes';
    halService = new HALEndpointServiceStub(restEndpointURL);
    publicationTypeString = 'Publication';
    personTypeString = 'Person';
    orgUnitTypeString = 'OrgUnit';
    publicationType = Object.assign(new ItemType(), { label: publicationTypeString });
    personType = Object.assign(new ItemType(), { label: personTypeString });
    orgUnitType = Object.assign(new ItemType(), { label: orgUnitTypeString });

    relationshipType1 = Object.assign(new RelationshipType(), {
      id: '1',
      uuid: '1',
      leftwardType: 'isAuthorOfPublication',
      rightwardType: 'isPublicationOfAuthor',
      leftType: createSuccessfulRemoteDataObject$(publicationType),
      rightType: createSuccessfulRemoteDataObject$(personType),
    });

    relationshipType2 = Object.assign(new RelationshipType(), {
      id: '2',
      uuid: '2',
      leftwardType: 'isOrgUnitOfPublication',
      rightwardType: 'isPublicationOfOrgUnit',
      leftType: createSuccessfulRemoteDataObject$(publicationType),
      rightType: createSuccessfulRemoteDataObject$(orgUnitType),
    });

    buildList = createSuccessfulRemoteDataObject(createPaginatedList([relationshipType1, relationshipType2]));
    rdbService = getMockRemoteDataBuildService(undefined, of(buildList));
    objectCache = new ObjectCacheServiceStub();
  }

  function initTestService() {
    return new RelationshipTypeDataService(
      requestService,
      rdbService,
      objectCache as ObjectCacheService,
      halService,
    );
  }

  beforeEach(() => {
    init();
    requestService = getMockRequestService();
    service = initTestService();
  });

  describe('getRelationshipTypeByLabelAndTypes', () => {

    it('should return the type filtered by label and type strings', (done) => {
      service.getRelationshipTypeByLabelAndTypes(relationshipType1.leftwardType, publicationTypeString, personTypeString).pipe(
        hasValueOperator(),
      ).subscribe((e) => {
        expect(e.id).toEqual(relationshipType1.id);
        done();
      });
    });
  });

});
