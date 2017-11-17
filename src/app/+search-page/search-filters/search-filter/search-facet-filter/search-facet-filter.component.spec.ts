import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchFacetFilterComponent } from './search-facet-filter.component';
import { SearchFilterService } from '../search-filter.service';
import { Router } from '@angular/router';

describe('SearchFacetFilterComponent', () => {
  let comp: SearchFacetFilterComponent;
  let fixture: ComponentFixture<SearchFacetFilterComponent>;
  const filterService: Store<SearchFilterService> = jasmine.createSpyObj('filterService', {
    isFilterActiveWithValue: (paramName: string, filterValue: string) => true,
    getQueryParamsWith: (paramName: string, filterValue: string) => '',
    getQueryParamsWithout: (paramName: string, filterValue: string) => '',
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NoopAnimationsModule],
      declarations: [SearchFacetFilterComponent],
      providers: [
        {
          provide: Router, useValue: {}
        },
        {
          provide: SearchFilterService,
          useValue: filterService
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(SearchFacetFilterComponent, {
      set: {  changeDetection: ChangeDetectionStrategy.Default  }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFacetFilterComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    fixture.detectChanges();
  });

});
