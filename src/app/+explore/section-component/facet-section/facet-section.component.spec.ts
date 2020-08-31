import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from 'src/app/shared/remote-data.utils';
import { FacetValue } from 'src/app/shared/search/facet-value.model';
import { FilterType } from 'src/app/shared/search/filter-type.model';
import { SearchFilterConfig } from 'src/app/shared/search/search-filter-config.model';
import { FacetSectionComponent } from './facet-section.component';

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
    type: FilterType.text,
    _embedded: {
      values: [authorFirstValue, authorSecondValue]
    }
  });

  const mockSubjectFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'subject',
    type: FilterType.hierarchy,
    _embedded: {
      values: []
    }
  });

  const mockDateIssuedFilterConfig = Object.assign(new SearchFilterConfig(), {
    name: 'dateIssued',
    type: FilterType.range,
    _embedded: {
      values: [dateIssuedValue]
    }
  });

  beforeEach(async(() => {

    searchServiceStub = {
      searchFacets(scope?: string, configurationName?: string): Observable<RemoteData<SearchFilterConfig[]>> {
        return createSuccessfulRemoteDataObject$([mockAuthorFilterConfig, mockSubjectFilterConfig, mockDateIssuedFilterConfig]);
      },
      getSearchLink(): string {
        return '/search';
      }
    }

    TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule, RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [FacetSectionComponent],
      providers: [FacetSectionComponent,
        { provide: SearchService, useValue: searchServiceStub }],
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
      style: 'col-md-12'
    }

    fixture.detectChanges();
  });

  it('should create FacetSectionComponent', inject([FacetSectionComponent], (comp: FacetSectionComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should create a facet section foreach not empty filter configs',  () => {
    const facets = fixture.debugElement.queryAll(By.css('.col-3.mb-4'));
    expect(facets.length).toEqual(2);

    const authorFacet = facets[0];
    expect(authorFacet.children.length).toEqual(3);

    const authorSpan = authorFacet.children[0];
    expect(authorSpan.name).toEqual('span');
    expect(authorSpan.nativeElement.textContent).toEqual('explore.index.author');

    const firstAuthor = authorFacet.children[1];
    expect(firstAuthor.name).toEqual('div');
    expect(firstAuthor.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.author=First%20Author');
    expect(firstAuthor.query(By.css('span.badge.badge-secondary')).nativeElement.textContent).toEqual('20');

    const secondAuthor = authorFacet.children[2];
    expect(secondAuthor.name).toEqual('div');
    expect(secondAuthor.query(By.css('a')).nativeElement.href).toContain('search?configuration=publication&page=1&f.author=Second%20Author');
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
