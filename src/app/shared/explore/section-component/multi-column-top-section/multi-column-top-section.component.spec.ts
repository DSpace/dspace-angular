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
    component.sectionId = 'section-a';
    component.topSection = topSection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should derive the pagination id from the section id and sort field', () => {
    const options = searchManager.search.calls.mostRecent().args[0] as PaginatedSearchOptions;
    expect(options.pagination.id).toEqual(`${component.sectionId}-multi-column-top-${topSection.sortField}`);
  });

  it('should use a distinct pagination id for sections with a different section id', () => {
    const second = TestBed.createComponent(MultiColumnTopSectionComponent);
    second.componentInstance.sectionId = 'section-b';
    second.componentInstance.topSection = topSection;
    second.detectChanges();

    const firstOptions = searchManager.search.calls.all()[searchManager.search.calls.count() - 2].args[0] as PaginatedSearchOptions;
    const secondOptions = searchManager.search.calls.mostRecent().args[0] as PaginatedSearchOptions;
    expect(firstOptions.pagination.id).not.toEqual(secondOptions.pagination.id);
  });
});
