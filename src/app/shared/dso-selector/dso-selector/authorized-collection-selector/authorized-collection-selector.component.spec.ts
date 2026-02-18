import { AuthorizedCollectionSelectorComponent } from './authorized-collection-selector.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VarDirective } from '../../../utils/var.directive';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ActionType } from '../../../../core/resource-policy/models/action-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { NotificationsService } from '../../../notifications/notifications.service';

describe('AuthorizedCollectionSelectorComponent', () => {
  let component: AuthorizedCollectionSelectorComponent;
  let fixture: ComponentFixture<AuthorizedCollectionSelectorComponent>;

  let collectionService;
  let collection;

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    collection = Object.assign(new Collection(), {
      id: 'authorized-collection'
    });
    collectionService = jasmine.createSpyObj('collectionService', {
      getSubmitAuthorizedCollection: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
      getAdminAuthorizedCollection: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
      getEditAuthorizedCollection: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
      getAuthorizedCollectionByEntityType: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      declarations: [AuthorizedCollectionSelectorComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: CollectionDataService, useValue: collectionService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedCollectionSelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.COLLECTION];
    fixture.detectChanges();
  });

  describe('search', () => {
    describe('when action type is ADD', () => {
      describe('when has no entity type', () => {
        it('should call getSubmitAuthorizedCollection and return the authorized collection in a SearchResult', (done) => {
          component.action = ActionType.ADD;
          fixture.detectChanges();
          component.search('', 1).subscribe((resultRD) => {
            expect(collectionService.getSubmitAuthorizedCollection).toHaveBeenCalled();
            expect(resultRD.payload.page.length).toEqual(1);
            expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
            done();
          });
        });
      });

      describe('when has entity type', () => {
        it('should call getAuthorizedCollectionByEntityType and return the authorized collection in a SearchResult', (done) => {
          component.entityType = 'test';
          component.action = ActionType.ADD;
          fixture.detectChanges();
          component.search('', 1).subscribe((resultRD) => {
            expect(collectionService.getAuthorizedCollectionByEntityType).toHaveBeenCalled();
            expect(resultRD.payload.page.length).toEqual(1);
            expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
            done();
          });
        });
      });
    });

    describe('when action type is WRITE', () => {
      it('should call getEditAuthorizedCollection', (done) => {
        component.action = ActionType.WRITE;
        fixture.detectChanges();
        component.search('', 1).subscribe((resultRD) => {
          expect(collectionService.getEditAuthorizedCollection).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
          done();
        });
      });
    });

    describe('when action is not provided', () => {
      it('should call getAdminAuthorizedCollection', (done) => {
        component.search('', 1).subscribe((resultRD) => {
          expect(collectionService.getAdminAuthorizedCollection).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
          done();
        });
      });
    });
  });
});
