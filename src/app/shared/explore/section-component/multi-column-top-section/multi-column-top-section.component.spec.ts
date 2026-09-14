import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchManager } from '@dspace/core/browse/search-manager';
import { MultiColumnTopSection } from '@dspace/core/layout/models/section.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { MultiColumnTopSectionComponent } from './multi-column-top-section.component';

describe('MultiColumnTopSectionComponent', () => {
  let component: MultiColumnTopSectionComponent;
  let fixture: ComponentFixture<MultiColumnTopSectionComponent>;
  let searchManager: jasmine.SpyObj<SearchManager>;

  const topSection: MultiColumnTopSection = {
    discoveryConfigurationName: 'publication',
    componentType: 'multi-column-top',
    style: 'col-md-12',
    order: 'desc',
    sortField: 'dc.date.accessioned',
    titleKey: 'lastPublications',
    columnList: [],
  };

  beforeEach(waitForAsync(() => {
    searchManager = jasmine.createSpyObj('SearchManager', ['search']);
    searchManager.search.and.returnValue(createSuccessfulRemoteDataObject$({ page: [] } as any));

    TestBed.configureTestingModule({
      imports: [MultiColumnTopSectionComponent, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: SearchManager, useValue: searchManager },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiColumnTopSectionComponent);
    component = fixture.componentInstance;
    component.topSection = topSection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate a unique pagination id per instance', () => {
    const second = TestBed.createComponent(MultiColumnTopSectionComponent).componentInstance;
    expect(component.paginationId).toMatch(/^search-object-pagination-/);
    expect(second.paginationId).toMatch(/^search-object-pagination-/);
    expect(component.paginationId).not.toEqual(second.paginationId);
  });

  it('should use its unique pagination id in the search options', () => {
    const options = searchManager.search.calls.mostRecent().args[0] as PaginatedSearchOptions;
    expect(options.pagination.id).toEqual(component.paginationId);
  });
});
