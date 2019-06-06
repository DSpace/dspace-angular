import { RelatedEntitiesSearchComponent } from './related-entities-search.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchFixedFilterService } from '../../../../+search-page/search-filters/search-filter/search-fixed-filter.service';
import { Item } from '../../../../core/shared/item.model';

describe('RelatedEntitiesSearchComponent', () => {
  let comp: RelatedEntitiesSearchComponent;
  let fixture: ComponentFixture<RelatedEntitiesSearchComponent>;
  let fixedFilterService: SearchFixedFilterService;

  const mockItem = Object.assign(new Item(), {
    id: 'id1'
  });
  const mockRelationType = 'publicationsOfAuthor';
  const mockRelationEntityType = 'publication';
  const mockFilter= `f.${mockRelationType}=${mockItem.id}`;
  const fixedFilterServiceStub = {
    getFilterByRelation: () => mockFilter
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, FormsModule],
      declarations: [RelatedEntitiesSearchComponent],
      providers: [
        { provide: SearchFixedFilterService, useValue: fixedFilterServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedEntitiesSearchComponent);
    comp = fixture.componentInstance;
    fixedFilterService = (comp as any).fixedFilterService;
    comp.relationType = mockRelationType;
    comp.item = mockItem;
    comp.relationEntityType = mockRelationEntityType;
    fixture.detectChanges();
  });

  it('should create a fixedFilter', () => {
    expect(comp.fixedFilter).toEqual(mockFilter);
  });

  it('should create a fixedFilter$', () => {
    comp.fixedFilter$.subscribe((fixedFilter) => {
      expect(fixedFilter).toEqual(mockRelationEntityType);
    })
  });

});
