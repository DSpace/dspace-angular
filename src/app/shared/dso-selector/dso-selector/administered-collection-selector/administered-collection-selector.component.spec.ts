import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { VarDirective } from '../../../utils/var.directive';
import { AdministeredCollectionSelectorComponent } from './administered-collection-selector.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { FindListOptions } from '../../../../core/data/find-list-options.model';

describe('AdministeredCollectionSelectorComponent', () => {
  let component: AdministeredCollectionSelectorComponent;
  let fixture: ComponentFixture<AdministeredCollectionSelectorComponent>;

  let collectionService;
  let collection;

  let notificationsService: NotificationsService;

  const findOptions: FindListOptions = { currentPage: 1, elementsPerPage: 10 };

  beforeEach(waitForAsync(() => {
    collection = Object.assign(new Collection(), {
      id: 'admin-collection'
    });
    collectionService = jasmine.createSpyObj('collectionService', {
      getAdministeredCollectionByEntityType: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
      getAdministeredCollection: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
    });
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    TestBed.configureTestingModule({
      declarations: [AdministeredCollectionSelectorComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: CollectionDataService, useValue: collectionService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdministeredCollectionSelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.COLLECTION];
  }));



  describe('search without provided entityTpe', () => {

    it('should call getAdministeredCollectionByEntityType and return the authorized collection in a SearchResult', (done) => {

      fixture.detectChanges();

      component.search('', 1).subscribe((resultRD) => {
        expect(collectionService.getAdministeredCollection).toHaveBeenCalledWith('',  findOptions);
        expect(resultRD.payload.page.length).toEqual(1);
        expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
        done();
      });
    });
  });

  describe('search with provided entityTpe', () => {


    it('should call getAdministeredCollection and return the authorized collection in a SearchResult', (done) => {

      component.entityType = 'Publication';
      fixture.detectChanges();

      component.search('', 1).subscribe((resultRD) => {
        expect(collectionService.getAdministeredCollectionByEntityType).toHaveBeenCalledWith('', 'Publication',  findOptions);
        expect(resultRD.payload.page.length).toEqual(1);
        expect(resultRD.payload.page[0].indexableObject).toEqual(collection);
        done();
      });
    });
  });

});
