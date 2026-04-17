import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { HierarchicalBrowseDefinition } from '../../core/shared/hierarchical-browse-definition.model';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyTreeviewComponent } from '../../shared/form/vocabulary-treeview/vocabulary-treeview.component';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { createDataWithBrowseDefinition } from '../browse-by-switcher/browse-by-switcher.component.spec';
import { BrowseByTaxonomyComponent } from './browse-by-taxonomy.component';

describe('BrowseByTaxonomyComponent', () => {
  let component: BrowseByTaxonomyComponent;
  let fixture: ComponentFixture<BrowseByTaxonomyComponent>;
  let themeService: ThemeService;
  let detail1: VocabularyEntryDetail;
  let detail2: VocabularyEntryDetail;

  const data = new BehaviorSubject(createDataWithBrowseDefinition(new HierarchicalBrowseDefinition()));
  const activatedRouteStub = {
    data,
  };

  beforeEach(async () => {
    themeService = jasmine.createSpyObj('themeService', {
      getThemeName: 'dspace',
    });

    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), BrowseByTaxonomyComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ThemeService, useValue: themeService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BrowseByTaxonomyComponent, {
        remove: { imports: [VocabularyTreeviewComponent] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByTaxonomyComponent);
    component = fixture.componentInstance;
    spyOn(component, 'updateQueryParams').and.callThrough();
    fixture.detectChanges();
    detail1 = new VocabularyEntryDetail();
    detail2 = new VocabularyEntryDetail();
    detail1.value = 'HUMANITIES and RELIGION';
    detail2.value = 'TECHNOLOGY';
    detail1.id = 'id-1';
    detail2.id = 'id-2';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle select event', () => {
    component.onSelect(detail1);
    expect(component.selectedItems.length).toBe(1);
    expect(component.selectedItems).toContain(detail1);
    expect(component.selectedItems.length).toBe(1);
    expect(component.filterValues).toEqual(['HUMANITIES and RELIGION,equals'] );
    expect(component.updateQueryParams).toHaveBeenCalled();
  });

  it('should handle select event with multiple selected items', () => {
    component.onSelect(detail1);
    component.onSelect(detail2);
    expect(component.selectedItems.length).toBe(2);
    expect(component.selectedItems).toContain(detail1, detail2);
    expect(component.selectedItems.length).toBe(2);
    expect(component.filterValues).toEqual(['HUMANITIES and RELIGION,equals', 'TECHNOLOGY,equals'] );
    expect(component.updateQueryParams).toHaveBeenCalled();
  });

  it('should handle deselect event', () => {
    component.onSelect(detail1);
    component.onSelect(detail2);
    expect(component.selectedItems.length).toBe(2);
    expect(component.selectedItems.length).toBe(2);
    component.onDeselect(detail1);
    expect(component.selectedItems.length).toBe(1);
    expect(component.selectedItems).toContain(detail2);
    expect(component.selectedItems.length).toBe(1);
    expect(component.filterValues).toEqual(['TECHNOLOGY,equals'] );
    expect(component.updateQueryParams).toHaveBeenCalled();
  });

  describe('updateQueryParams', () => {
    beforeEach(() => {
      component.facetType = 'subject';
      component.filterValues = ['HUMANITIES and RELIGION,equals', 'TECHNOLOGY,equals'];
    });

    it('should update the queryParams with the selected filterValues', () => {
      component.updateQueryParams();

      expect(component.queryParams).toEqual({
        'f.subject': ['HUMANITIES and RELIGION,equals', 'TECHNOLOGY,equals'],
      });
    });

    it('should include the scope if present', () => {
      component.scope = '67f849f1-2499-4872-8c61-9e2b47d71068';

      component.updateQueryParams();

      expect(component.queryParams).toEqual({
        'f.subject': ['HUMANITIES and RELIGION,equals', 'TECHNOLOGY,equals'],
        'scope': '67f849f1-2499-4872-8c61-9e2b47d71068',
      });
    });
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });
});
