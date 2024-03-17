import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { VarDirective } from '../../../utils/var.directive';
import { AuthorizedCollectionSelectorComponent } from './authorized-collection-selector.component';

describe('AuthorizedCollectionSelectorComponent', () => {
  let component: AuthorizedCollectionSelectorComponent;
  let fixture: ComponentFixture<AuthorizedCollectionSelectorComponent>;

  let collectionService;
  let collection;

  let notificationsService: NotificationsService;

  beforeEach(waitForAsync(() => {
    collection = Object.assign(new Collection(), {
      id: 'authorized-collection',
    });
    collectionService = jasmine.createSpyObj('collectionService', {
      getAuthorizedCollection: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
      getAuthorizedCollectionByEntityType: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), AuthorizedCollectionSelectorComponent, VarDirective],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: CollectionDataService, useValue: collectionService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AuthorizedCollectionSelectorComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent, ThemedLoadingComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizedCollectionSelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.COLLECTION];
    fixture.detectChanges();
  });

  describe('search', () => {
    describe('when has no entity type', () => {
      it('should call getAuthorizedCollection and return the authorized collection in a SearchResult', (done) => {
        component.search('', 1).subscribe((resultRD) => {
          expect(collectionService.getAuthorizedCollection).toHaveBeenCalled();
          expect(resultRD.payload.page.length).toEqual(1);
          expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
          done();
        });
      });
    });

    describe('when has entity type', () => {
      it('should call getAuthorizedCollectionByEntityType and return the authorized collection in a SearchResult', (done) => {
        component.entityType = 'test';
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
});
