import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { DSOSelectorComponent } from './dso-selector.component';
import { SearchService } from '../../../core/shared/search/search.service';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ItemSearchResult } from '../../object-collection/shared/item-search-result.model';
import { Item } from '../../../core/shared/item.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { PaginatedSearchOptions } from '../../search/paginated-search-options.model';

describe('DSOSelectorComponent', () => {
  let component: DSOSelectorComponent;
  let fixture: ComponentFixture<DSOSelectorComponent>;
  let debugElement: DebugElement;

  const currentDSOId = 'test-uuid-ford-sose';
  const type = DSpaceObjectType.ITEM;
  const searchResult = new ItemSearchResult();
  const item = new Item();
  item.metadata = {
    'dc.title': [Object.assign(new MetadataValue(), {
      value: 'Item title',
      language: undefined
    })]
  };
  searchResult.indexableObject = item;
  searchResult.hitHighlights = {};
  const searchService = jasmine.createSpyObj('searchService', {
    search: createSuccessfulRemoteDataObject$(new PaginatedList(undefined, [searchResult]))
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [DSOSelectorComponent],
      providers: [
        { provide: SearchService, useValue: searchService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DSOSelectorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.currentDSOId = currentDSOId;
    component.type = type;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initially call the search method on the SearchService with the given DSO uuid', () => {
    const searchOptions = new PaginatedSearchOptions({
      query: currentDSOId,
      dsoType: type,
      pagination: (component as any).defaultPagination
    });

    expect(searchService.search).toHaveBeenCalledWith(searchOptions);
  });
});
