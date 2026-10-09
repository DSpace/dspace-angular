import { PLATFORM_ID } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchManager } from '@dspace/core/browse/search-manager';
import { InternalLinkService } from '@dspace/core/services/internal-link.service';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import {
  CountersSection,
  CountersSectionComponent,
} from './counters-section.component';

describe('CountersSectionComponent', () => {
  let component: CountersSectionComponent;
  let fixture: ComponentFixture<CountersSectionComponent>;

  let searchManagerStub: any;
  let internalLinkServiceStub: any;

  const countersSection: CountersSection = {
    componentType: 'counters',
    style: '',
    counterSettingsList: [
      {
        discoveryConfigurationName: 'publication',
        entityName: 'publications',
        icon: 'fa fa-book',
        link: '/search?configuration=publication',
      },
      {
        discoveryConfigurationName: 'person',
        entityName: 'persons',
        icon: 'fa fa-user',
        link: 'https://external.example.com/persons',
      },
    ],
  };

  beforeEach(waitForAsync(() => {
    searchManagerStub = {
      search: jasmine.createSpy('search'),
    };
    searchManagerStub.search.and.returnValues(
      createSuccessfulRemoteDataObject$({ totalElements: 42 }),
      createSuccessfulRemoteDataObject$({ totalElements: 7 }),
    );

    internalLinkServiceStub = {
      isLinkInternal: (link: string): boolean => link.startsWith('/'),
      getRelativePath: (link: string): string => link,
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        CountersSectionComponent,
      ],
      providers: [
        { provide: SearchManager, useValue: searchManagerStub },
        { provide: InternalLinkService, useValue: internalLinkServiceStub },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    })
      .overrideComponent(CountersSectionComponent, { remove: { imports: [ThemedLoadingComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountersSectionComponent);
    component = fixture.componentInstance;
    component.sectionId = 'entities';
    component.countersSection = countersSection;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the pagination based on the sectionId', () => {
    expect(component.pagination.id).toEqual('counters-paginationentities');
    expect(component.pagination.pageSize).toEqual(1);
    expect(component.pagination.currentPage).toEqual(1);
  });

  it('should perform one search per counter setting', () => {
    expect(searchManagerStub.search).toHaveBeenCalledTimes(2);
  });

  it('should map the search results into counter data', fakeAsync(() => {
    let result;
    component.counterData$.subscribe((data) => result = data);
    tick();
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual(jasmine.objectContaining({ count: '42', label: 'publications', icon: 'fa fa-book' }));
    expect(result[1]).toEqual(jasmine.objectContaining({ count: '7', label: 'persons', icon: 'fa fa-user' }));
  }));

  it('should set isLoading$ to false once the data is loaded', fakeAsync(() => {
    tick();
    let loading;
    component.isLoading$.subscribe((value) => loading = value);
    expect(loading).toBe(false);
  }));

  describe('rendering', () => {
    beforeEach(fakeAsync(() => {
      tick();
      fixture.detectChanges();
    }));

    it('should hide the loading indicator when done', () => {
      const loading = fixture.debugElement.query(By.css('ds-loading'));
      expect(loading).toBeNull();
    });

    it('should render a counter block per counter', () => {
      const counters = fixture.debugElement.queryAll(By.css('.counters-section'));
      expect(counters.length).toEqual(2);
    });

    it('should render the counts', () => {
      const counters = fixture.debugElement.queryAll(By.css('.counters-section'));
      expect(counters[0].nativeElement.textContent).toContain('42');
      expect(counters[1].nativeElement.textContent).toContain('7');
    });

    it('should render an internal link with routerLink for internal counters', () => {
      const anchors = fixture.debugElement.queryAll(By.css('a.text-decoration-none'));
      expect(anchors.length).toEqual(2);
      const internalLink = anchors.find((a) => a.attributes.href && a.attributes.href.startsWith('/search'));
      expect(internalLink).toBeTruthy();
    });

    it('should render an external link opening in a new tab for external counters', () => {
      const externalLink = fixture.debugElement.query(By.css('a[target="_blank"]'));
      expect(externalLink).toBeTruthy();
      expect(externalLink.nativeElement.getAttribute('href')).toEqual('https://external.example.com/persons');
    });
  });

  describe('when rendered on the server', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
    });

    it('should not run the search on the server platform', waitForAsync(() => {
      const serverSearchManager = { search: jasmine.createSpy('search') };
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateLoaderMock,
            },
          }),
          CountersSectionComponent,
        ],
        providers: [
          { provide: SearchManager, useValue: serverSearchManager },
          { provide: InternalLinkService, useValue: { isLinkInternal: () => true, getRelativePath: (l) => l } },
          { provide: PLATFORM_ID, useValue: 'server' },
        ],
      })
        .overrideComponent(CountersSectionComponent, { remove: { imports: [ThemedLoadingComponent] } })
        .compileComponents().then(() => {
          const serverFixture = TestBed.createComponent(CountersSectionComponent);
          const serverComponent = serverFixture.componentInstance;
          serverComponent.sectionId = 'entities';
          serverComponent.countersSection = countersSection;
          serverFixture.detectChanges();
          expect(serverSearchManager.search).not.toHaveBeenCalled();
          expect(serverComponent.counterData$).toBeUndefined();
        });
    }));
  });
});
