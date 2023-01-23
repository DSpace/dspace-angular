import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditableItemSelectorComponent } from './editable-item-selector.component';
import { FindListOptions } from '../../../../core/data/find-list-options.model';
import { Item } from '../../../../core/shared/item.model';
import { createSuccessfulRemoteDataObject$, createFailedRemoteDataObject$ } from '../../../remote-data.utils';
import { createPaginatedList } from '../../../testing/utils.test';
import { ItemSearchResult } from '../../../object-collection/shared/item-search-result.model';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationsService } from '../../../notifications/notifications.service';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { TranslateModule } from '@ngx-translate/core';

describe('EditableItemSelectorComponent', () => {
  let component: EditableItemSelectorComponent;
  let fixture: ComponentFixture<EditableItemSelectorComponent>;

  function createFindItemsResult(name: string): Item {
    return Object.assign(new Item(), {
      id: `test-result-${name}`,
      metadata: {
        'dc.title': [
          {
            value: `test-result - ${name}`
          }
        ]
      }
    });
  }

  const currentDSOId = 'test-uuid-ford-sose';
  const type = DSpaceObjectType.ITEM;
  const currentResult = createFindItemsResult('current');
  const pages = [
    ['1','2','3'].map(createFindItemsResult),
    ['4','5','6'].map(createFindItemsResult),
  ];

/*
    beforeEach(() => {
    dsoService = {
      findByIdAndIDType: jasmine.createSpy('findByIdAndIDType').and.returnValue(observableOf({ hasFailed: false,
        hasSucceeded: true }))
    };
    guard = new LookupGuard(dsoService);
  });
 */
  let itemDataService;
  let notificationsService: NotificationsService;

  beforeEach(waitForAsync( () => {
    notificationsService = jasmine.createSpyObj('notificationsService', ['error']);
    itemDataService = {
      findItemsWithEdit: jasmine.createSpy('findItemsWithEdit').and.callFake(
        (query: string, options: FindListOptions,
         useCachedVersionIfAvailable = true, reRequestOnStale = true) => {
          return createSuccessfulRemoteDataObject$(createPaginatedList(
            query.startsWith('search.resourceid') ? [currentResult] : pages[options.currentPage - 1]
          ));
        }
      )
    };
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [EditableItemSelectorComponent],
      providers: [
        { provide: ItemDataService, useValue: itemDataService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: SearchService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableItemSelectorComponent);
    component = fixture.componentInstance;
    component.currentDSOId = currentDSOId;
    component.types = [type];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('populating listEntries', () => {
    it('should not be empty', (done) => {
      component.listEntries$.subscribe((listEntries) => {
        expect(listEntries.length).toBeGreaterThan(0);
        done();
      });
    });

    it('should contain a combination of the current DSO and first page results', (done) => {
      component.listEntries$.subscribe((listEntries) => {
        expect(listEntries.map(entry => (entry as ItemSearchResult).indexableObject))
          .toEqual([currentResult, ...pages[0]]);
        done();
      });
    });

    describe('when current page increases', () => {
      beforeEach(() => {
        component.currentPage$.next(2);
      });

      it('should contain a combination of the current DSO, as well as first and second page results', (done) => {
        component.listEntries$.subscribe((listEntries) => {
          expect(listEntries.map(entry => (entry as ItemSearchResult).indexableObject))
            .toEqual([currentResult, ...pages[0], ...pages[1]]);
          done();
        });
      });
    });

    describe('when search returns an error', () => {
      beforeEach(() => {
        itemDataService.findItemsWithEdit.and.returnValue(createFailedRemoteDataObject$());
        component.ngOnInit();
      });

      it('should display an error notification', () => {
        expect(notificationsService.error).toHaveBeenCalled();
      });
    });
  });
});
