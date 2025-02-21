import {
  DebugElement,
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
import { TranslateModule } from '@ngx-translate/core';

import { CollectionDataService } from '@dspace/core';
import { ConfigurationDataService } from '@dspace/core';
import { FindListOptions } from '@dspace/core';
import { buildPaginatedList } from '@dspace/core';
import { GroupDataService } from '@dspace/core';
import { PaginationService } from '@dspace/core';
import { LinkHeadService } from '@dspace/core';
import { Community } from '@dspace/core';
import { ConfigurationProperty } from '@dspace/core';
import { PageInfo } from '@dspace/core';
import { SearchConfigurationService } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { HostWindowServiceStub } from '@dspace/core';
import { PaginationServiceStub } from '@dspace/core';
import { SearchConfigurationServiceStub } from '@dspace/core';
import { createPaginatedList } from '@dspace/core';
import { HostWindowService } from '../../../../shared/host-window.service';
import { getMockThemeService } from '../../../../shared/mocks/theme-service.mock';
import { SelectableListService } from '../../../../../../modules/core/src/lib/core/states/selectable-list/selectable-list.service';
import { ThemeService } from '../../../../shared/theme-support/theme.service';
import { CommunityPageSubCollectionListComponent } from './community-page-sub-collection-list.component';

describe('CommunityPageSubCollectionListComponent', () => {
  let comp: CommunityPageSubCollectionListComponent;
  let fixture: ComponentFixture<CommunityPageSubCollectionListComponent>;
  let collectionDataServiceStub: any;
  let themeService;
  let subCollList = [];

  const collections = [Object.assign(new Community(), {
    id: '123456789-1',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 1' },
      ],
    },
  }),
  Object.assign(new Community(), {
    id: '123456789-2',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 2' },
      ],
    },
  }),
  Object.assign(new Community(), {
    id: '123456789-3',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 3' },
      ],
    },
  }),
  Object.assign(new Community(), {
    id: '123456789-4',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 4' },
      ],
    },
  }),
  Object.assign(new Community(), {
    id: '123456789-5',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 5' },
      ],
    },
  }),
  Object.assign(new Community(), {
    id: '123456789-6',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 6' },
      ],
    },
  }),
  Object.assign(new Community(), {
    id: '123456789-7',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 7' },
      ],
    },
  }),
  ];

  const mockCommunity = Object.assign(new Community(), {
    id: '123456789',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Test title' },
      ],
    },
  });

  collectionDataServiceStub = {
    findByParent(parentUUID: string, options: FindListOptions = {}) {
      let currentPage = options.currentPage;
      let elementsPerPage = options.elementsPerPage;
      if (currentPage === undefined) {
        currentPage = 1;
      }
      elementsPerPage = 5;
      const startPageIndex = (currentPage - 1) * elementsPerPage;
      let endPageIndex = (currentPage * elementsPerPage);
      if (endPageIndex > subCollList.length) {
        endPageIndex = subCollList.length;
      }
      return createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), subCollList.slice(startPageIndex, endPageIndex)));

    },
  };

  const paginationService = new PaginationServiceStub();

  themeService = getMockThemeService();

  const linkHeadService = jasmine.createSpyObj('linkHeadService', {
    addTag: '',
  });

  const groupDataService = jasmine.createSpyObj('groupsDataService', {
    findListByHref: createSuccessfulRemoteDataObject$(createPaginatedList([])),
    getGroupRegistryRouterLink: '',
    getUUIDFromString: '',
  });

  const configurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'test',
      values: [
        'org.dspace.ctask.general.ProfileFormats = test',
      ],
    })),
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        NgbModule,
        NoopAnimationsModule,
        CommunityPageSubCollectionListComponent,
      ],
      providers: [
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: PaginationService, useValue: paginationService },
        { provide: SelectableListService, useValue: {} },
        { provide: ThemeService, useValue: themeService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: LinkHeadService, useValue: linkHeadService },
        { provide: ConfigurationDataService, useValue: configurationDataService },
        { provide: SearchConfigurationService, useValue: new SearchConfigurationServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageSubCollectionListComponent);
    comp = fixture.componentInstance;
    comp.community = mockCommunity;
  });


  it('should display a list of collections', async () => {
    subCollList = collections;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const collList: DebugElement[] = fixture.debugElement.queryAll(By.css('ul[data-test="objects"] li'));
    expect(collList.length).toEqual(5);
    expect(collList[0].nativeElement.textContent).toContain('Collection 1');
    expect(collList[1].nativeElement.textContent).toContain('Collection 2');
    expect(collList[2].nativeElement.textContent).toContain('Collection 3');
    expect(collList[3].nativeElement.textContent).toContain('Collection 4');
    expect(collList[4].nativeElement.textContent).toContain('Collection 5');
  });

  it('should not display the header when list of collections is empty', () => {
    subCollList = [];
    fixture.detectChanges();

    const subComHead = fixture.debugElement.queryAll(By.css('h2'));
    expect(subComHead.length).toEqual(0);
  });
});
