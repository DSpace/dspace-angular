import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  buildPaginatedList,
  PaginatedList,
} from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Item } from '@dspace/core/shared/item.model';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { PaginationServiceStub } from '@dspace/core/testing/pagination-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { ObjectCollectionComponent } from '../../../../../object-collection/object-collection.component';
import { PageSizeSelectorComponent } from '../../../../../page-size-selector/page-size-selector.component';
import { SearchConfigurationService } from '../../../../../search/search-configuration.service';
import { VarDirective } from '../../../../../utils/var.directive';
import { DsDynamicLookupRelationSelectionTabComponent } from './dynamic-lookup-relation-selection-tab.component';

describe('DsDynamicLookupRelationSelectionTabComponent', () => {
  let component: DsDynamicLookupRelationSelectionTabComponent;
  let fixture: ComponentFixture<DsDynamicLookupRelationSelectionTabComponent>;
  let pSearchOptions = new PaginatedSearchOptions({ pagination: new PaginationComponentOptions() });
  let item1 = Object.assign(new Item(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
  let item2 = Object.assign(new Item(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
  let searchResult1 = Object.assign(new ItemSearchResult(), { indexableObject: item1 });
  let searchResult2 = Object.assign(new ItemSearchResult(), { indexableObject: item2 });
  let listID = '6b0c8221-fcb4-47a8-b483-ca32363fffb3';
  let selection$;
  let selectionRD$;
  let router;

  function init() {
    pSearchOptions = new PaginatedSearchOptions({ pagination: new PaginationComponentOptions() });
    item1 = Object.assign(new Item(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
    item2 = Object.assign(new Item(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
    searchResult1 = Object.assign(new ItemSearchResult(), { indexableObject: item1 });
    searchResult2 = Object.assign(new ItemSearchResult(), { indexableObject: item2 });
    listID = '6b0c8221-fcb4-47a8-b483-ca32363fffb3';
    selection$ = of([searchResult1, searchResult2]);
    selectionRD$ = createSelection([searchResult1, searchResult2]);
    router = jasmine.createSpyObj('router', ['navigate']);
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DsDynamicLookupRelationSelectionTabComponent, VarDirective],
      providers: [
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: of(pSearchOptions),
          },
        },
        {
          provide: Router, useValue: router,
        },
        {
          provide: PaginationService, useValue: new PaginationServiceStub(),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(DsDynamicLookupRelationSelectionTabComponent, {
        remove: {
          imports: [ObjectCollectionComponent,
            PageSizeSelectorComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationSelectionTabComponent);
    component = fixture.componentInstance;
    component.selection$ = selection$;
    component.listId = listID;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigate on the router when is called resetRoute', () => {
    component.selectionRD$ = createSelection([]);
    fixture.detectChanges();
    const colComponent = fixture.debugElement.query(By.css('ds-viewable-collection'));
    expect(colComponent).toBe(null);
  });

  it('should call navigate on the router when is called resetRoute', () => {
    component.selectionRD$ = selectionRD$;
    const colComponent = fixture.debugElement.query(By.css('ds-viewable-collection'));
    expect(colComponent).not.toBe(null);
  });
});

function createSelection(content: ListableObject[]): Observable<RemoteData<PaginatedList<ListableObject>>> {
  return createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, content));
}
