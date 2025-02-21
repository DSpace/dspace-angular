import { hasValueOperator } from '@dspace/shared/utils';
import { of as observableOf } from 'rxjs';

import { ObjectCacheService } from '../cache';
import { getMockRemoteDataBuildService } from '../mocks';
import { getMockRequestService } from '../mocks';
import { ItemType } from '../shared';
import { RelationshipType } from '../shared';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../utilities';
import { HALEndpointServiceStub } from '../utilities';
import { ObjectCacheServiceStub } from '../utilities';
import { createPaginatedList } from '../utilities';
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
    rdbService = getMockRemoteDataBuildService(undefined, observableOf(buildList));
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
