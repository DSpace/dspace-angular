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

describe('AdministeredCollectionSelectorComponent', () => {
  let component: AdministeredCollectionSelectorComponent;
  let fixture: ComponentFixture<AdministeredCollectionSelectorComponent>;

  let collectionService;
  let collection;

  beforeEach(waitForAsync(() => {
    collection = Object.assign(new Collection(), {
      id: 'admin-collection'
    });
    collectionService = jasmine.createSpyObj('collectionService', {
      getAdministeredCollection: createSuccessfulRemoteDataObject$(createPaginatedList([collection])),
    });
    TestBed.configureTestingModule({
      declarations: [AdministeredCollectionSelectorComponent, VarDirective],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SearchService, useValue: {} },
        { provide: CollectionDataService, useValue: collectionService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministeredCollectionSelectorComponent);
    component = fixture.componentInstance;
    component.types = [DSpaceObjectType.COLLECTION];
    fixture.detectChanges();
  });

  describe('search', () => {
      it('should call getAdministeredCollection and return the authorized collection in a SearchResult', (done) => {
        component.search('', 1).subscribe((result) => {
          expect(collectionService.getAdministeredCollection).toHaveBeenCalled();
          expect(result.page.length).toEqual(1);
          expect(result.page[0].indexableObject).toEqual(collection);
          done();
        });
      });
    });
});
