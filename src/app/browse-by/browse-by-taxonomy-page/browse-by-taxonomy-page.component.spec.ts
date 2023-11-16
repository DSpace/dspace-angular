import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByTaxonomyPageComponent } from './browse-by-taxonomy-page.component';
import { VocabularyEntryDetail } from '../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { createDataWithBrowseDefinition } from '../browse-by-switcher/browse-by-switcher.component.spec';
import { HierarchicalBrowseDefinition } from '../../core/shared/hierarchical-browse-definition.model';
import { ThemeService } from '../../shared/theme-support/theme.service';

describe('BrowseByTaxonomyPageComponent', () => {
  let component: BrowseByTaxonomyPageComponent;
  let fixture: ComponentFixture<BrowseByTaxonomyPageComponent>;
  let themeService: ThemeService;
  let detail1: VocabularyEntryDetail;
  let detail2: VocabularyEntryDetail;

  const data = new BehaviorSubject(createDataWithBrowseDefinition(new HierarchicalBrowseDefinition()));
  const activatedRouteStub = {
    data
  };

  beforeEach(async () => {
    themeService = jasmine.createSpyObj('themeService', {
      getThemeName: 'dspace',
    });

    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ],
      declarations: [ BrowseByTaxonomyPageComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: ThemeService, useValue: themeService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByTaxonomyPageComponent);
    component = fixture.componentInstance;
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
  });

  it('should handle select event with multiple selected items', () => {
    component.onSelect(detail1);
    component.onSelect(detail2);
    expect(component.selectedItems.length).toBe(2);
    expect(component.selectedItems).toContain(detail1, detail2);
    expect(component.selectedItems.length).toBe(2);
    expect(component.filterValues).toEqual(['HUMANITIES and RELIGION,equals', 'TECHNOLOGY,equals'] );
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
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
  });
});
