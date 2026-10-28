import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthService } from '@dspace/core/auth/auth.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Item } from '@dspace/core/shared/item.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { URLCombiner } from '@dspace/core/url-combiner/url-combiner';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import {
  of,
  throwError,
} from 'rxjs';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { SearchService } from '../../../shared/search/search.service';
import { getItemEditRoute } from '../../item-page-routing-paths';
import { CustomUrlConflictErrorComponent } from './custom-url-conflict-error.component';

@Component({
  selector: 'ds-alert',
  template: '<ng-content></ng-content>',
})
class AlertComponentStub {}

describe('CustomUrlConflictErrorComponent', () => {
  let component: CustomUrlConflictErrorComponent;
  let fixture: ComponentFixture<CustomUrlConflictErrorComponent>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const customUrl = 'my-conflicting-url';

  const mockItem1 = Object.assign(new Item(), {
    uuid: 'item-uuid-1',
    name: 'Item One',
    metadata: {},
    _links: { self: { href: 'item-1-selflink' } },
  });

  const mockItem2 = Object.assign(new Item(), {
    uuid: 'item-uuid-2',
    name: 'Item Two',
    metadata: {},
    _links: { self: { href: 'item-2-selflink' } },
  });

  const buildSearchResult = (item: Item): SearchResult<Item> =>
    Object.assign(new SearchResult<Item>(), { indexableObject: item });

  const buildSearchObjects = (items: Item[]): SearchObjects<Item> =>
    Object.assign(new SearchObjects<Item>(), { page: items.map(buildSearchResult) });

  const expectedEditLink = (item: Item) =>
    new URLCombiner(getItemEditRoute(item, true), 'metadata').toString();

  const createComponent = () => {
    fixture = TestBed.createComponent(CustomUrlConflictErrorComponent);
    component = fixture.componentInstance;
    component.customUrl = customUrl;
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['search']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    searchServiceSpy.search.and.returnValue(
      createSuccessfulRemoteDataObject$(buildSearchObjects([])),
    );
    authServiceSpy.isAuthenticated.and.returnValue(of(true));

    TestBed.configureTestingModule({
      imports: [
        CustomUrlConflictErrorComponent,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateLoaderMock },
        }),
      ],
      providers: [
        provideNoopAnimations(),
        provideRouter([]),
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    })
      .overrideComponent(CustomUrlConflictErrorComponent, {
        remove: { imports: [AlertComponent] },
        add: { imports: [AlertComponentStub] },
      })
      .compileComponents();
  }));

  describe('when search returns matching items', () => {
    beforeEach(() => {
      searchServiceSpy.search.and.returnValue(
        createSuccessfulRemoteDataObject$(buildSearchObjects([mockItem1, mockItem2])),
      );
    });

    it('should create', () => {
      createComponent();
      expect(component).toBeTruthy();
    });

    it('should call SearchService.search with a query containing the custom URL', () => {
      createComponent();
      expect(searchServiceSpy.search).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ query: `dspace.customurl:${customUrl}` }),
      );
    });

    it('should emit one entry per conflicting item', (done) => {
      createComponent();
      component.conflictingItems$.subscribe((items) => {
        expect(items.length).toBe(2);
        done();
      });
    });

    it('should build the correct metadata edit link for each item', (done) => {
      createComponent();
      component.conflictingItems$.subscribe((items) => {
        expect(items[0].editLink).toBe(expectedEditLink(mockItem1));
        expect(items[1].editLink).toBe(expectedEditLink(mockItem2));
        done();
      });
    });

    it('should use DSONameService to resolve item names', (done) => {
      createComponent();
      component.conflictingItems$.subscribe((items) => {
        expect(items[0].name).toBe(mockItem1.name);
        expect(items[1].name).toBe(mockItem2.name);
        done();
      });
    });

    describe('when user is authenticated', () => {
      beforeEach(() => {
        authServiceSpy.isAuthenticated.and.returnValue(of(true));
        createComponent();
      });

      it('should render one edit link (<a>) per item', () => {
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.css('ul li a'));
        expect(links.length).toBe(2);
      });

      it('should not render plain text spans for items', () => {
        fixture.detectChanges();
        const spans = fixture.debugElement.queryAll(By.css('ul li span'));
        expect(spans.length).toBe(0);
      });
    });

    describe('when user is not authenticated', () => {
      beforeEach(() => {
        authServiceSpy.isAuthenticated.and.returnValue(of(false));
        createComponent();
      });

      it('should not render any edit links (<a>)', () => {
        fixture.detectChanges();
        const links = fixture.debugElement.queryAll(By.css('ul li a'));
        expect(links.length).toBe(0);
      });

      it('should render one plain text span per item', () => {
        fixture.detectChanges();
        const spans = fixture.debugElement.queryAll(By.css('ul li span'));
        expect(spans.length).toBe(2);
      });
    });
  });

  describe('when search returns no items', () => {
    beforeEach(() => {
      searchServiceSpy.search.and.returnValue(
        createSuccessfulRemoteDataObject$(buildSearchObjects([])),
      );
      createComponent();
    });

    it('should emit an empty array', (done) => {
      component.conflictingItems$.subscribe((items) => {
        expect(items.length).toBe(0);
        done();
      });
    });

    it('should show the no-items-found message', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('error.custom-url-conflict.no-items-found');
    });
  });

  describe('when search throws an error', () => {
    beforeEach(() => {
      searchServiceSpy.search.and.returnValue(throwError(() => new Error('Network error')));
      createComponent();
    });

    it('should emit an empty array on error', (done) => {
      component.conflictingItems$.subscribe((items) => {
        expect(items).toEqual([]);
        done();
      });
    });
  });
});

