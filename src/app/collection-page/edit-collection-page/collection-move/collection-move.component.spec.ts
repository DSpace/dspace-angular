import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { getMockRequestService } from '@dspace/core/testing/request.service.mock';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { Community } from 'src/app/core/shared/community.model';
import { AuthorizedCommunitySelectorComponent } from 'src/app/shared/dso-selector/dso-selector/authorized-community-selector/authorized-community-selector.component';

import { RequestService } from '../../../core/data/request.service';
import { Collection } from '../../../core/shared/collection.model';
import { SearchService } from '../../../shared/search/search.service';
import { CollectionMoveComponent } from './collection-move.component';

describe('CollectionMoveComponent', () => {
  let comp: CollectionMoveComponent;
  let fixture: ComponentFixture<CollectionMoveComponent>;

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    uuid: 'test-collection-1-1',
    name: 'test-collection-1',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-1-1',
      },
    },
  });

  const collectionPageUrl = `fake-url/${mockCollection.id}`;
  const routerStub = Object.assign(new RouterStub(), {
    url: `${collectionPageUrl}/edit`,
  });

  const community1 = Object.assign(new Community(), {
    uuid: 'community-uuid-1',
    name: 'Test community 1',
  });

  const community2 = Object.assign(new Community(), {
    uuid: 'community-uuid-2',
    name: 'Test community 2',
  });

  let collectionDataService;

  const mockCollectionDataServiceSuccess = jasmine.createSpyObj({
    moveToCommunity: createSuccessfulRemoteDataObject$(community1),
    findById: createSuccessfulRemoteDataObject$(mockCollection),
  });

  const mockCollectionDataServiceFail = jasmine.createSpyObj({
    moveToCommunity: createFailedRemoteDataObject$('Internal server error', 500),
    findById: createSuccessfulRemoteDataObject$(mockCollection),
  });

  const routeStub = {
    parent: {
      data: of({
        dso: createSuccessfulRemoteDataObject(Object.assign(new Collection(), {
          id: 'collection1',
          parentCommunity: createSuccessfulRemoteDataObject$(Object.assign(new Community(), {
            id: 'originalOwningCommunity',
          })),
        })),
      }),
    },
  };

  const mockSearchService = {
    search: () => {
      return createSuccessfulRemoteDataObject$(createPaginatedList([
        {
          indexableObject: community1,
          hitHighlights: {},
        }, {
          indexableObject: community2,
          hitHighlights: {},
        },
      ]));
    },
  };

  const notificationsServiceStub = new NotificationsServiceStub();

  const init = (mockCollectionDataService) => {
    collectionDataService = mockCollectionDataService;

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, CollectionMoveComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub },
        { provide: CollectionDataService, useValue: mockCollectionDataService },
        { provide: NotificationsService, useValue: notificationsServiceStub },
        { provide: SearchService, useValue: mockSearchService },
        { provide: RequestService, useValue: getMockRequestService() },
      ], schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
      ],
    })
      .overrideComponent(CollectionMoveComponent, {
        remove: {
          imports: [AuthorizedCommunitySelectorComponent],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CollectionMoveComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('CollectionMoveComponent success', () => {
    beforeEach(() => {
      init(mockCollectionDataServiceSuccess);
    });

    it('should get current url ', () => {
      expect(comp.getCurrentUrl()).toEqual('fake-url/test-collection-1-1/edit');
    });
    it('should select the correct community name and id on click', () => {
      const data = community1;

      comp.selectDso(data);

      expect(comp.selectedCommunityName).toEqual('Test community 1');
      expect(comp.selectedCommunity).toEqual(community1);
    });
    describe('moveCommunity', () => {
      it('should call collectionDataService.moveToCommunity', () => {
        comp.collection = Object.assign(new Collection(), {
          id: 'collection-id',
          uuid: 'collection-id',
        });
        comp.selectedCommunityName = 'selected-community-id';
        comp.selectedCommunity = community1;
        comp.moveToCommunity();

        expect(collectionDataService.moveToCommunity).toHaveBeenCalledWith('collection-id', community1);
      });
      it('should call notificationsService success message on success', () => {
        comp.moveToCommunity();

        expect(notificationsServiceStub.success).toHaveBeenCalled();
      });
    });
  });

  describe('CollectionMoveComponent fail', () => {
    beforeEach(() => {
      init(mockCollectionDataServiceFail);
    });

    it('should call notificationsService error message on fail', () => {
      comp.moveToCommunity();

      expect(notificationsServiceStub.error).toHaveBeenCalled();
    });
  });
});
