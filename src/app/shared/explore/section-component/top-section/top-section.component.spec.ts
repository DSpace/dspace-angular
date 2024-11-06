import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { SearchService } from '../../../../core/shared/search/search.service';
import { TranslateLoaderMock } from '../../../mocks/translate-loader.mock';
import { TopSectionComponent } from './top-section.component';
import { SearchResult } from '../../../search/models/search-result.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { createSuccessfulRemoteDataObject$ } from '../../../remote-data.utils';
import { TopSectionTemplateType } from '../../../../core/layout/models/section.model';

describe('TopSectionComponent', () => {
  let component: TopSectionComponent;
  let fixture: ComponentFixture<TopSectionComponent>;

  let searchServiceStub: any;

  const firstSearchResult = Object.assign(new SearchResult(), {
    _embedded: {
      indexableObject: Object.assign(new DSpaceObject(), {
        id: 'd317835d-7b06-4219-91e2-1191900cb897',
        uuid: 'd317835d-7b06-4219-91e2-1191900cb897',
        name: 'My first publication',
        metadata: {
          'dspace.entity.type': [
            { value: 'Publication' }
          ]
        }
      })
    }
  });

  const secondSearchResult = Object.assign(new SearchResult(), {
    _embedded: {
      indexableObject: Object.assign(new DSpaceObject(), {
        id: '0c34d491-b5ed-4a78-8b29-83d0bad80e5a',
        uuid: '0c34d491-b5ed-4a78-8b29-83d0bad80e5a',
        name: 'This is a publication'
      })
    }
  });

  beforeEach(waitForAsync(() => {
    searchServiceStub = jasmine.createSpyObj('SearchService', {
      search: jasmine.createSpy('search'),
      getSearchLink: jasmine.createSpy('getSearchLink')
    });

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
    searchServiceStub.search.and.returnValue(createSuccessfulRemoteDataObject$({ page: [firstSearchResult, secondSearchResult] }));
    searchServiceStub.getSearchLink.and.returnValue('/search');
    component.sectionId = 'publications';
    component.topSection = {
      discoveryConfigurationName: 'publication',
      componentType: 'top',
      style: 'col-md-6',
      order: 'desc',
      sortField: 'dc.date.accessioned',
      numberOfItems: 5,
      titleKey: undefined,
      showThumbnails: false,
      template: TopSectionTemplateType.DEFAULT
    };

    fixture.detectChanges();
  });

  it('should create TopSectionComponent', inject([TopSectionComponent], (comp: TopSectionComponent) => {
    expect(comp).toBeDefined();
  }));

  // it('should create a top section with two entries', () => {
  //
  //   const cardElement = fixture.debugElement.query(By.css('.card.mb-4'));
  //   expect(cardElement).not.toBeNull();
  //   expect(cardElement.query(By.css('.card-header')).nativeElement.textContent).toEqual('explore.index.dc.date.accessioned');
  //
  //   const links = cardElement.queryAll(By.css('a'));
  //   expect(links.length).toEqual(2);
  //   expect(links[0].nativeElement.href).toContain('/entities/publication/d317835d-7b06-4219-91e2-1191900cb897');
  //   expect(links[0].nativeElement.textContent).toEqual('My first publication');
  //   expect(links[1].nativeElement.href).toContain('items/0c34d491-b5ed-4a78-8b29-83d0bad80e5a');
  //   expect(links[1].nativeElement.textContent).toEqual('This is a publication');
  //
  // });

  describe('Top section with title key defined', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(TopSectionComponent);
      component = fixture.componentInstance;
      searchServiceStub.search.and.returnValue(createSuccessfulRemoteDataObject$({ page: [firstSearchResult, secondSearchResult] }));
      searchServiceStub.getSearchLink.and.returnValue('/search');
      component.sectionId = 'publications';
      component.topSection = {
        discoveryConfigurationName: 'publication',
        componentType: 'top',
        style: 'col-md-6',
        order: 'desc',
        sortField: 'dc.date.foo',
        numberOfItems: 5,
        titleKey: 'lastPublications',
        showThumbnails: false,
        template: TopSectionTemplateType.DEFAULT
      };

      fixture.detectChanges();
    });

    it('should create a top section with title', () => {

      const cardElement = fixture.debugElement.query(By.css('.card.mb-4'));
      expect(cardElement).not.toBeNull();
      expect(cardElement.query(By.css('.card-header')).nativeElement.textContent).toEqual('explore.index.lastPublications');


    });
  });

  });
