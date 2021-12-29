import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { SearchService } from '../../../../core/shared/search/search.service';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { FacetValue } from '../../../search/facet-value.model';
import { FilterType } from '../../../search/filter-type.model';
import { SearchFilterConfig } from '../../../search/search-filter-config.model';
import { FacetSectionComponent } from './facet-section.component';
import {SEARCH_CONFIG_SERVICE} from '../../../../my-dspace-page/my-dspace-page.component';
import {SearchConfigurationServiceStub} from '../../../testing/search-configuration-service.stub';
import {StoreModule} from '@ngrx/store';
import {authReducer} from '../../../../core/auth/auth.reducer';
import {storeModuleConfig} from '../../../../app.reducer';
import {isNotNull} from '../../../empty.util';

describe('FacetSectionComponent', () => {
  let component: FacetSectionComponent;
  let fixture: ComponentFixture<FacetSectionComponent>;

  let searchServiceStub: any;

  const dateIssuedValue: FacetValue = {
    label: '1996 - 1999',
    value: '1996 - 1999',
    count: 35,
    _links: {
      self: { href: 'di-selectedValue-self-link' },
      search: { href: '' }
    }
  };

  const authorFirstValue: FacetValue = {
    label: 'First Author',
    value: 'First Author',
    count: 20,
    _links: {
      self: { href: 'fa-selectedValue-self-link' },
      search: { href: '' }
    }
  };

  const authorSecondValue: FacetValue = {
    label: 'Second Author',
    value: 'Second Author',
    count: 15,
    _links: {
      self: { href: 'sa-selectedValue-self-link1' },
      search: { href: '' }
    }
  };

  const mockAuthorFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'author',
    filterType: FilterType.text,
    _embedded: {
      values: [authorFirstValue, authorSecondValue]
    }
  });

  const mockSubjectFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'subject',
    filterType: FilterType.hierarchy,
    _embedded: {
      values: []
    }
  });

  const mockDateIssuedFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType.range,
    _embedded: {
      values: [dateIssuedValue]
    }
  });
  const barChartFacetValue: FacetValue = {
    label: '2007',
    value: '2007',
    count: 13,
    _links: {
      self: { href: 'fa-selectedValue-self-link' },
      search: { href: '' }
    }
  };
  const mockGraphBarChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType['chart.bar'],
    _embedded: {
      values: [barChartFacetValue]
    }
  });
  const pieChartFacetValue: FacetValue = {
    label: 'Other',
    value: 'Other',
    count: 13,
    _links: {
      self: { href: 'fa-selectedValue-self-link' },
      search: { href: '' }
    }
  };
  const mockGraphPieChartFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    filterType: FilterType['chart.pie'],
    _embedded: {
      values: [pieChartFacetValue]
    }
  });
  beforeEach(async(() => {

    searchServiceStub = {
      searchFacets(scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
        return createSuccessfulRemoteDataObject$([mockAuthorFilterConfig, mockSubjectFilterConfig, mockDateIssuedFilterConfig, mockGraphBarChartFilterConfig, mockGraphPieChartFilterConfig]);
      },
      getSearchLink(): string {
        return '/search';
      }
    };

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        StoreModule.forRoot({ auth: authReducer }, storeModuleConfig),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [FacetSectionComponent],
      providers: [FacetSectionComponent,
        { provide: SearchService, useValue: searchServiceStub },
        { provide: SEARCH_CONFIG_SERVICE, useValue: new SearchConfigurationServiceStub() }],
      schemas: [NO_ERRORS_SCHEMA]
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
      facetsPerRow: 4
    };

    fixture.detectChanges();
  });

  it('should create FacetSectionComponent', inject([FacetSectionComponent], (comp: FacetSectionComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should create a facet section foreach not empty filter configs',  () => {
    // graph facets control
    const graphFacets = fixture.debugElement.queryAll(By.css('.col-6.mb-4'));
    expect(graphFacets.length).toEqual(2);
    const barChartFacet = graphFacets[0];
    expect(barChartFacet.name).toEqual('div');
    expect(barChartFacet.children.length).toEqual(2);
    const barChartComponent = barChartFacet.query(By.css('ds-search-chart'));
    expect(isNotNull(barChartComponent)).toBe(true);
    const pieChartFacet = graphFacets[1];
    expect(pieChartFacet.children.length).toEqual(2);
    expect(pieChartFacet.name).toEqual('div');
    const pieChartComponent = pieChartFacet.query(By.css('ds-search-chart'));
    expect(isNotNull(pieChartComponent)).toBe(true);

    const facets = fixture.debugElement.queryAll(By.css('.col-3.mb-4'));
    expect(facets.length).toEqual(2);

    const authorFacet = facets[0];
    expect(authorFacet.children.length).toEqual(3);

    const authorSpan = authorFacet.children[0];
    expect(authorSpan.name).toEqual('span');
    expect(authorSpan.nativeElement.textContent).toEqual('explore.index.author');

    const firstAuthor = authorFacet.children[1];
    expect(firstAuthor.name).toEqual('div');
    expect(firstAuthor.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.author=First%20Author,equals');
    expect(firstAuthor.query(By.css('span.badge.badge-secondary')).nativeElement.textContent).toEqual('20');

    const secondAuthor = authorFacet.children[2];
    expect(secondAuthor.name).toEqual('div');
    expect(secondAuthor.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.author=Second%20Author,equals');
    expect(secondAuthor.query(By.css('span.badge.badge-secondary')).nativeElement.textContent).toEqual('15');

    const dateIssuedFacet = facets[1];
    expect(dateIssuedFacet.children.length).toEqual(2);

    const dateIssuedSpan = dateIssuedFacet.children[0];
    expect(dateIssuedSpan.name).toEqual('span');
    expect(dateIssuedSpan.nativeElement.textContent).toEqual('explore.index.dateIssued');

    const dateIssued = dateIssuedFacet.children[1];
    expect(dateIssued.name).toEqual('div');
    expect(dateIssued.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.dateIssued.min=1996&f.dateIssued.max=1999');
    expect(dateIssued.query(By.css('span.badge.badge-secondary')).nativeElement.textContent).toEqual('35');
  });

});
