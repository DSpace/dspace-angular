import { RequestService } from './request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { getMockRemoteDataBuildService } from '../../shared/mocks/mock-remote-data-build.service';
import { RelationshipType } from '../shared/item-relationships/relationship-type.model';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { PaginatedList } from './paginated-list';
import { PageInfo } from '../shared/page-info.model';
import { createSuccessfulRemoteDataObject, createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { RelationshipTypeService } from './relationship-type.service';
import { of as observableOf } from 'rxjs';
import { ItemType } from '../shared/item-relationships/item-type.model';

fdescribe('RelationshipTypeService', () => {
  let service: RelationshipTypeService;
  let requestService: RequestService;

  const restEndpointURL = 'https://rest.api/relationshiptypes';
  const halService: any = new HALEndpointServiceStub(restEndpointURL);
  const publicationTypeString = 'Publication';
  const personTypeString = 'Person';
  const orgUnitTypeString = 'OrgUnit';
  const publicationType = Object.assign(new ItemType(), {label: publicationTypeString});
  const personType = Object.assign(new ItemType(), {label: personTypeString});
  const orgUnitType = Object.assign(new ItemType(), {label: orgUnitTypeString});

  const relationshipType1 = Object.assign(new RelationshipType(), {
    id: '1',
    uuid: '1',
    leftwardType: 'isAuthorOfPublication',
    rightwardType: 'isPublicationOfAuthor',
    leftType: createSuccessfulRemoteDataObject$(publicationType),
    rightType: createSuccessfulRemoteDataObject$(personType)
  });


  const relationshipType2 = Object.assign(new RelationshipType(), {
    id: '2',
    uuid: '2',
    leftwardType: 'isOrgUnitOfPublication',
    rightwardType: 'isPublicationOfOrgUnit',
    leftType: createSuccessfulRemoteDataObject$(publicationType),
    rightType: createSuccessfulRemoteDataObject$(orgUnitType)
  });

  const buildList = createSuccessfulRemoteDataObject(new PaginatedList(new PageInfo(), [relationshipType1, relationshipType2]));
  const rdbService = getMockRemoteDataBuildService(undefined, observableOf(buildList));

  function initTestService() {
    return new RelationshipTypeService(
      requestService,
      halService,
      rdbService
    );
  }

  beforeEach(() => {
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
