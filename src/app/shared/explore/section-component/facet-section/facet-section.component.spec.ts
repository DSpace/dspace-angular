import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  BrowserModule,
  By,
} from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { authReducer } from '@dspace/core/auth/auth.reducer';
import { RemoteData } from '@dspace/core/data/remote-data';
import { FacetValue } from '@dspace/core/shared/search/models/facet-value.model';
import { FilterType } from '@dspace/core/shared/search/models/filter-type.model';
import { SearchFilterConfig } from '@dspace/core/shared/search/models/search-filter-config.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { StoreModule } from '@ngrx/store';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SearchService } from 'src/app/shared/search/search.service';
import { SearchConfigurationService } from 'src/app/shared/search/search-configuration.service';

import { storeModuleConfig } from '../../../../app.reducer';
import { FacetSectionComponent } from './facet-section.component';

describe('FacetSectionComponent', () => {
  let component: FacetSectionComponent;
  let fixture: ComponentFixture<FacetSectionComponent>;

  let searchServiceStub: any;
  let searchConfigurationStub: any;

  const dateIssuedValue: FacetValue = {
    label: '1996 - 1999',
    value: '1996 - 1999',
    count: 35,
    _links: {
      self: { href: 'di-selectedValue-self-link' },
      search: { href: '' },
    },
  };

  const authorFirstValue: FacetValue = {
    label: 'First Author',
    value: 'First Author',
    count: 20,
    _links: {
      self: { href: 'fa-selectedValue-self-link' },
      search: { href: '' },
    },
  };

  const authorSecondValue: FacetValue = {
    label: 'Second Author',
    value: 'Second Author',
    count: 15,
    _links: {
      self: { href: 'sa-selectedValue-self-link1' },
      search: { href: '' },
    },
  };

  const mockAuthorFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'author',
    filterType: FilterType.text,
    _embedded: {
      values: [authorFirstValue, authorSecondValue],
    },
  });

  const mockSubjectFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'subject',
    filterType: FilterType.hierarchy,
    _embedded: {
      values: [],
    },
  });

  const mockDateIssuedFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType.range,
    _embedded: {
      values: [dateIssuedValue],
    },
  });
  const barChartFacetValue: FacetValue = {
    label: '2007',
    value: '2007',
    count: 13,
    _links: {
      self: { href: 'fa-selectedValue-self-link' },
      search: { href: '' },
    },
  };
  const mockGraphBarChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType['chart.bar'],
    _embedded: {
      values: [barChartFacetValue],
    },
  });
  const pieChartFacetValue: FacetValue = {
    label: 'Other',
    value: 'Other',
    count: 13,
    _links: {
      self: { href: 'fa-selectedValue-self-link' },
      search: { href: '' },
    },
  };
  const mockGraphPieChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType['chart.pie'],
    _embedded: {
      values: [pieChartFacetValue],
    },
  });
  beforeEach(waitForAsync(() => {

    searchServiceStub = {
      getSearchLink(): string {
        return '/search';
      },
    };
    searchConfigurationStub = {
      searchFacets(scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
        return createSuccessfulRemoteDataObject$([mockAuthorFilterConfig, mockSubjectFilterConfig, mockDateIssuedFilterConfig, mockGraphBarChartFilterConfig, mockGraphPieChartFilterConfig]);
      },
    };

    searchServiceStub = {
      getSearchLink(): string {
        return '/search';
      },
    };

    TestBed.configureTestingModule({
      imports: [CommonModule,
        BrowserModule,
        RouterTestingModule,
        StoreModule.forRoot({ auth: authReducer }, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }), FacetSectionComponent],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SearchConfigurationService, useValue: searchConfigurationStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetSectionComponent);
    component = fixture.componentInstance;

    component.sectionId = 'publications';
    component.facetSection = {
      discoveryConfigurationName: 'publication',
      componentType: 'facet',
      style: 'col-md-12',
      facetsPerRow: 4,
    };

    fixture.detectChanges();
  });

  it('should create FacetSectionComponent',  () => {
    expect(component).toBeDefined();
  });

  it('should create a facet section foreach not empty filter configs',  () => {
    const facets = fixture.debugElement.queryAll(By.css('.col-lg-3.mb-4'));
    expect(facets.length).toEqual(4);

    const authorFacet = facets[0];
    expect(authorFacet.children.length).toEqual(3);

    const authorSpan = authorFacet.children[0];
    expect(authorSpan.name).toEqual('h5');
    expect(authorSpan.nativeElement.textContent).toEqual('explore.index.author');

    const firstAuthor = authorFacet.children[1];
    expect(firstAuthor.name).toEqual('div');
    expect(firstAuthor.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.author=First%20Author,equals');
    expect(firstAuthor.query(By.css('span.badge.bg-secondary')).nativeElement.textContent).toEqual('20');

    const secondAuthor = authorFacet.children[2];
    expect(secondAuthor.name).toEqual('div');
    expect(secondAuthor.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.author=Second%20Author,equals');
    expect(secondAuthor.query(By.css('span.badge.bg-secondary')).nativeElement.textContent).toEqual('15');

    const dateIssuedFacet = facets[1];
    expect(dateIssuedFacet.children.length).toEqual(2);

    const dateIssuedSpan = dateIssuedFacet.children[0];
    expect(dateIssuedSpan.name).toEqual('h5');
    expect(dateIssuedSpan.nativeElement.textContent).toEqual('explore.index.dateIssued');

    const dateIssued = dateIssuedFacet.children[1];
    expect(dateIssued.name).toEqual('div');
    expect(dateIssued.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.dateIssued.min=1996&f.dateIssued.max=1999');
    expect(dateIssued.query(By.css('span.badge.bg-secondary')).nativeElement.textContent).toEqual('35');
  });

});
