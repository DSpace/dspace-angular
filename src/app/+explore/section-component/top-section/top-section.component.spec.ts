import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { RequestEntry } from 'src/app/core/data/request.reducer';
import { SearchService } from 'src/app/core/shared/search/search.service';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';
import { PaginatedSearchOptions } from 'src/app/shared/search/paginated-search-options.model';
import { TopSectionComponent } from './top-section.component';
import { RestResponse } from 'src/app/core/cache/response.models';
import { SearchQueryResponse } from 'src/app/shared/search/search-query-response.model';
import { SearchResult } from 'src/app/shared/search/search-result.model';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

describe('TopSectionComponent', () => {
  let component: TopSectionComponent;
  let fixture: ComponentFixture<TopSectionComponent>;

  let searchServiceStub: any;

  const firstSearchResult = Object.assign(new SearchResult(), {
    _embedded: {
      indexableObject : Object.assign( new DSpaceObject(),{
        id: 'd317835d-7b06-4219-91e2-1191900cb897',
        name: 'My first publication'
      })
    }
  });

  const secondSearchResult = Object.assign(new SearchResult(), {
    _embedded: {
      indexableObject : Object.assign( new DSpaceObject(),{
        id: '0c34d491-b5ed-4a78-8b29-83d0bad80e5a',
        name: 'This is a publication'
      })
    }
  });

  beforeEach(async(() => {

    searchServiceStub = {
      searchEntries(searchOptions?: PaginatedSearchOptions, responseMsToLive?: number): Observable<{searchOptions: PaginatedSearchOptions, requestEntry: RequestEntry}> {
        const searchQueryResponse = new SearchQueryResponse();
        searchQueryResponse.objects = [firstSearchResult, secondSearchResult];

        const requestEntry = new RequestEntry();
        requestEntry.response = Object.assign( new RestResponse(true, 200, 'OK'),  {
          results: searchQueryResponse
        });

        return of({searchOptions: searchOptions, requestEntry: requestEntry});
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
      declarations: [TopSectionComponent],
      providers: [TopSectionComponent,
        { provide: SearchService, useValue: searchServiceStub }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSectionComponent);
    component = fixture.componentInstance;

    component.sectionId = 'publications';
    component.topSection = {
      discoveryConfigurationName: 'publication',
      componentType: 'top',
      style: 'col-md-6',
      order: 'desc',
      sortField: 'dc.date.accessioned'
    }

    fixture.detectChanges();
  });

  it('should create TopSectionComponent', inject([TopSectionComponent], (comp: TopSectionComponent) => {
    expect(comp).toBeDefined();
  }));

  it('should create a top section with two entries',  () => {

    const cardElement = fixture.debugElement.query(By.css('.card.mb-4'));
    expect(cardElement).not.toBeNull();
    expect(cardElement.query(By.css('.card-header')).nativeElement.textContent).toEqual('explore.index.dc.date.accessioned');

    const links = cardElement.queryAll(By.css('a'));
    expect(links.length).toEqual(2);
    expect(links[0].nativeElement.href).toContain('/items/d317835d-7b06-4219-91e2-1191900cb897');
    expect(links[0].nativeElement.textContent).toEqual('My first publication');
    expect(links[1].nativeElement.href).toContain('/items/0c34d491-b5ed-4a78-8b29-83d0bad80e5a');
    expect(links[1].nativeElement.textContent).toEqual('This is a publication');

  });

});
