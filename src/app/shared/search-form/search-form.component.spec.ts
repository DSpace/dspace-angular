import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Community } from '../../core/shared/community.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchFilterService } from '../../core/shared/search/search-filter.service';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { PaginationServiceStub } from '../testing/pagination-service.stub';
import { RouterStub } from '../testing/router.stub';
import { SearchFilterServiceStub } from '../testing/search-filter-service.stub';
import { SearchServiceStub } from '../testing/search-service.stub';
import { SearchFormComponent } from './search-form.component';

describe('SearchFormComponent', () => {
  let comp: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let de: DebugElement;

  const router = new RouterStub();
  const searchService = new SearchServiceStub();
  let searchFilterService: SearchFilterServiceStub;
  const paginationService = new PaginationServiceStub();
  const searchConfigService = { paginationID: 'test-id' };
  const firstPage = { 'spc.page': 1 };
  const dspaceObjectService = {
    findById: () => createSuccessfulRemoteDataObject$(undefined),
  };

  beforeEach(waitForAsync(() => {
    searchFilterService = new SearchFilterServiceStub();

    return TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, TranslateModule.forRoot(), SearchFormComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: SearchService, useValue: searchService },
        { provide: SearchFilterService, useValue: searchFilterService },
        { provide: PaginationService, useValue: paginationService },
        { provide: SearchConfigurationService, useValue: searchConfigService },
        { provide: DSpaceObjectDataService, useValue: dspaceObjectService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    comp = fixture.componentInstance; // SearchFormComponent test instance
    de = fixture.debugElement.query(By.css('form'));
  });

  it('should not display scopes when showScopeSelector is false', fakeAsync(() => {
    comp.showScopeSelector = false;

    fixture.detectChanges();
    tick();

    expect(de.query(By.css('.scope-button'))).toBeFalsy();
  }));

  it('should display scopes when showScopeSelector is true', fakeAsync(() => {
    comp.showScopeSelector = true;

    fixture.detectChanges();
    tick();

    expect(de.query(By.css('.scope-button'))).toBeTruthy();
  }));

  it('should display set query value in input field', fakeAsync(() => {
    const testString = 'This is a test query';
    comp.query = testString;

    fixture.detectChanges();
    tick();
    const queryInput = de.query(By.css('input')).nativeElement;

    expect(queryInput.value).toBe(testString);
  }));

  it('should select correct scope option in scope select', fakeAsync(() => {

    fixture.detectChanges();
    comp.showScopeSelector = true;
    const testCommunity = objects[1];
    comp.selectedScope.next(testCommunity);

    fixture.detectChanges();
    tick();
    const scopeSelect = de.query(By.css('.scope-button')).nativeElement;

    expect(scopeSelect.textContent).toContain('Sample Community');
  }));

  describe('updateSearch', () => {
    const query = 'THOR';
    const scope = 'MCU';
    let searchQuery = {};

    it('should navigate to the search first page even when no parameters are provided', () => {
      comp.updateSearch(searchQuery);

      expect(router.navigate).toHaveBeenCalledWith(comp.getSearchLinkParts(), {
        queryParams: { ...searchQuery, ...firstPage },
        queryParamsHandling: 'merge',
      });
    });

    it('should navigate to the search first page with parameters only query if only query is provided', () => {
      searchQuery = {
        query: query,
      };

      comp.updateSearch(searchQuery);

      expect(router.navigate).toHaveBeenCalledWith(comp.getSearchLinkParts(), {
        queryParams: { ...searchQuery, ...firstPage },
        queryParamsHandling: 'merge',
      });
    });

    it('should navigate to the search first page with parameters only query if only scope is provided', () => {
      searchQuery = {
        scope: scope,
      };

      comp.updateSearch(searchQuery);

      expect(router.navigate).toHaveBeenCalledWith(comp.getSearchLinkParts(), {
        queryParams: { ...searchQuery, ...firstPage },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('when the scope variable is used', () => {
    const query = 'THOR';
    const scope = 'MCU';
    let searchQuery = {};

    beforeEach(() => {
      spyOn(comp, 'updateSearch');
    });

    it('should only search in the provided scope', () => {
      searchQuery = {
        query: query,
        scope: scope,
      };

      comp.scope = scope;
      comp.onSubmit(searchQuery);

      expect(comp.updateSearch).toHaveBeenCalledWith(searchQuery);
    });

    it('should not create searchQuery with the scope if an empty scope is provided', () => {
      searchQuery = {
        query: query,
      };

      comp.scope = '';
      comp.onSubmit(searchQuery);

      expect(comp.updateSearch).toHaveBeenCalledWith(searchQuery);
    });
  });
});

const objects: DSpaceObject[] = [
  Object.assign(new Community(), {
    logo: {
      self: {
        _isScalar: true,
        value: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/10b636d0-7890-4968-bcd6-0d83bf4e2b42',
        scheduler: null,
      },
    },
    collections: {
      self: {
        _isScalar: true,
        value: '1506937433727',
        scheduler: null,
      },
    },
    _links: {
      self: {
        href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/communities/7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
      },
    },
    id: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    uuid: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    type: Community.type,
    metadata: {
      'dc.description': [
        {
          language: null,
          value: '',
        },
      ],
      'dc.description.abstract': [
        {
          language: null,
          value: 'This is a test community to hold content for the OR2017 demostration',
        },
      ],
      'dc.description.tableofcontents': [
        {
          language: null,
          value: '',
        },
      ],
      'dc.rights': [
        {
          language: null,
          value: '',
        },
      ],
      'dc.title': [
        {
          language: null,
          value: 'OR2017 - Demonstration',
        },
      ],
      'dc.identifier.uri': [
        {
          language: null,
          value: 'http://localhost:4000/handle/10673/11',
        },
      ],
    },
  }),
  Object.assign(new Community(),
    {
      logo: {
        self: {
          _isScalar: true,
          value: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/f446c17d-6d51-45ea-a610-d58a73642d40',
          scheduler: null,
        },
      },
      collections: {
        self: {
          _isScalar: true,
          value: '1506937433727',
          scheduler: null,
        },
      },
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/communities/9076bd16-e69a-48d6-9e41-0238cb40d863',
        },
      },
      id: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      uuid: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      type: Community.type,
      metadata: {
        'dc.description': [
          {
            language: null,
            value: '<p>This is the introductory text for the <em>Sample Community</em> on the DSpace Demonstration Site. It is editable by System or Community Administrators (of this Community).</p>\r\n<p><strong>DSpace Communities may contain one or more Sub-Communities or Collections (of Items).</strong></p>\r\n<p>This particular Community has its own logo (the <a href=\'http://www.duraspace.org/\'>DuraSpace</a> logo).</p>',
          },
        ],
        'dc.description.abstract': [
          {
            language: null,
            value: 'This is a sample top-level community',
          },
        ],
        'dc.description.tableofcontents': [
          {
            language: null,
            value: '<p>This is the <em>news section</em> for this <em>Sample Community</em>. System or Community Administrators (of this Community) can edit this News field.</p>',
          },
        ],
        'dc.rights': [
          {
            language: null,
            value: '<p><em>If this Community had special copyright text to display, it would be displayed here.</em></p>',
          },
        ],
        'dc.title': [
          {
            language: null,
            value: 'Sample Community',
          },
        ],
        'dc.identifier.uri': [
          {
            language: null,
            value: 'http://localhost:4000/handle/10673/1',
          },
        ],
      },
    },
  ),
];
