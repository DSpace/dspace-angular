import { CommonModule } from '@angular/common';
import {
  Component,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { buildPaginatedList } from '../../core/data/paginated-list.model';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { RouteService } from '../../core/services/route.service';
import { BrowseEntry } from '../../core/shared/browse-entry.model';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { ITEM } from '../../core/shared/item.resource-type';
import { PageInfo } from '../../core/shared/page-info.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { ViewMode } from '../../core/shared/view-mode.model';
import { HostWindowService } from '../host-window.service';
import { getMockThemeService } from '../mocks/theme-service.mock';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import {
  DEFAULT_CONTEXT,
  listableObjectComponent,
} from '../object-collection/shared/listable-object/listable-object.decorator';
import { ListableObjectComponentLoaderComponent } from '../object-collection/shared/listable-object/listable-object-component-loader.component';
import { BrowseEntryListElementComponent } from '../object-list/browse-entry-list-element/browse-entry-list-element.component';
import { SelectableListService } from '../object-list/selectable-list/selectable-list.service';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { HostWindowServiceStub } from '../testing/host-window-service.stub';
import { PaginationServiceStub } from '../testing/pagination-service.stub';
import { routeServiceStub } from '../testing/route-service.stub';
import { SearchConfigurationServiceStub } from '../testing/search-configuration-service.stub';
import { createPaginatedList } from '../testing/utils.test';
import { ThemeService } from '../theme-support/theme.service';
import { BrowseByComponent } from './browse-by.component';

@listableObjectComponent(BrowseEntry, ViewMode.ListElement, DEFAULT_CONTEXT, 'dspace')
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ds-browse-entry-list-element',
  standalone: true,
  template: '',
})
class MockThemedBrowseEntryListElementComponent {
}

describe('BrowseByComponent', () => {
  let comp: BrowseByComponent;
  let fixture: ComponentFixture<BrowseByComponent>;

  const groupDataService = jasmine.createSpyObj('groupsDataService', {
    findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    getGroupRegistryRouterLink: '',
    getUUIDFromString: '',
  });

  const linkHeadService = jasmine.createSpyObj('linkHeadService', {
    addTag: '',
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'test',
      values: [
        'org.dspace.ctask.general.ProfileFormats = test',
      ],
    })),
  });

  const paginationConfig = Object.assign(new PaginationComponentOptions(), {
    id: 'test-pagination',
    currentPage: 1,
    pageSizeOptions: [5, 10, 15, 20],
    pageSize: 15,
  });
  const paginationService = new PaginationServiceStub(paginationConfig);

  let themeService;

  beforeEach(waitForAsync(() => {
    themeService = getMockThemeService('base');
    void TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NgbModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        RouterTestingModule,
        NoopAnimationsModule,
        BrowseByComponent,
      ],
      providers: [
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub() },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: PaginationService, useValue: paginationService },
        { provide: MockThemedBrowseEntryListElementComponent },
        { provide: ThemeService, useValue: themeService },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: SelectableListService, useValue: {} },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(BrowseByComponent);
    comp = fixture.componentInstance;
    comp.paginationConfig = paginationConfig;
    fixture.detectChanges();
  }));

  it('should display a loading message when objects is empty', () => {
    (comp as any).objects = undefined;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-loading'))).not.toBeNull();
  });

  it('should display results when objects is not empty', () => {
    comp.objects$ = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [
      Object.assign(new BrowseEntry(), {
        type: ITEM,
        authority: 'authority key 1',
        value: 'browse entry 1',
        language: null,
        count: 1,
      }),
    ]));
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('ds-viewable-collection'))).not.toBeNull();
  });

  describe('when showPaginator is true and browseEntries are provided', () => {
    let browseEntries;

    beforeEach(() => {
      browseEntries = [
        Object.assign(new BrowseEntry(), {
          type: ITEM,
          authority: 'authority key 1',
          value: 'browse entry 1',
          language: null,
          count: 1,
        }),
        Object.assign(new BrowseEntry(), {
          type: ITEM,
          authority: null,
          value: 'browse entry 2',
          language: null,
          count: 4,
        }),
      ];

      comp.showPaginator = true;
      comp.objects$ = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), browseEntries));
      comp.paginationConfig = paginationConfig;
      comp.sortConfig = Object.assign(new SortOptions('dc.title', SortDirection.ASC));
      // NOTE: do NOT trigger change detection until the theme is set, such that the theme can be picked up as well
    });

    describe('when theme is base', () => {
      beforeEach(async () => {
        themeService.getThemeName.and.returnValue('base');
        themeService.getThemeName$.and.returnValue(of('base'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      });

      it('should use the base component to render browse entries', () => {
        const componentLoaders = fixture.debugElement.queryAll(By.directive(ListableObjectComponentLoaderComponent));
        expect(componentLoaders.length).toEqual(browseEntries.length);
        componentLoaders.forEach((componentLoader) => {
          const browseEntry = componentLoader.query(By.css('ds-browse-entry-list-element'));
          expect(browseEntry.componentInstance).toBeInstanceOf(BrowseEntryListElementComponent);
        });
      });
    });

    describe('when theme is dspace', () => {
      beforeEach(async () => {
        themeService.getThemeName.and.returnValue('dspace');
        themeService.getThemeName$.and.returnValue(of('dspace'));
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
      });

      it('should use the themed component to render browse entries', () => {
        const componentLoaders = fixture.debugElement.queryAll(By.directive(ListableObjectComponentLoaderComponent));
        expect(componentLoaders.length).toEqual(browseEntries.length);
        componentLoaders.forEach((componentLoader) => {
          const browseEntry = componentLoader.query(By.css('ds-browse-entry-list-element'));
          expect(browseEntry.componentInstance).toBeInstanceOf(MockThemedBrowseEntryListElementComponent);
        });
      });
    });
  });

  describe('reset filters button', () => {
    it('should not be present when no startsWith or value is present ', () => {
      const button = fixture.debugElement.query(By.css('.reset'));
      expect(button).toBeNull();
    });
    it('should be present when a startsWith or value is present ', () => {
      comp.objects$ = createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [
        Object.assign(new BrowseEntry(), {
          type: ITEM,
          authority: 'authority key 1',
          value: 'browse entry 1',
          language: null,
          count: 1,
        }),
      ]));
      comp.shouldDisplayResetButton$ = of(true);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('.reset'));
      expect(button).not.toBeNull();
    });
  });

});
