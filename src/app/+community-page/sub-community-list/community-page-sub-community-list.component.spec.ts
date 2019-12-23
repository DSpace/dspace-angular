import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { CommunityPageSubCommunityListComponent } from './community-page-sub-community-list.component';
import { Community } from '../../core/shared/community.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { SharedModule } from '../../shared/shared.module';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { FindListOptions } from '../../core/data/request.models';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service-stub';
import { CommunityDataService } from '../../core/data/community-data.service';

describe('SubCommunityList Component', () => {
  let comp: CommunityPageSubCommunityListComponent;
  let fixture: ComponentFixture<CommunityPageSubCommunityListComponent>;
  let communityDataServiceStub: any;
  let subCommList = [];

  const subcommunities = [Object.assign(new Community(), {
    id: '123456789-1',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'SubCommunity 1' }
      ]
    }
  }),
    Object.assign(new Community(), {
      id: '123456789-2',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'SubCommunity 2' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-3',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'SubCommunity 3' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '12345678942',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'SubCommunity 4' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-5',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'SubCommunity 5' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-6',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'SubCommunity 6' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-7',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'SubCommunity 7' }
        ]
      }
    })
  ];

  const mockCommunity = Object.assign(new Community(), {
    id: '123456789',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Test title' }
      ]
    }
  });

  communityDataServiceStub = {
    findByParent(parentUUID: string, options: FindListOptions = {}) {
      let currentPage = options.currentPage;
      let elementsPerPage = options.elementsPerPage;
      if (currentPage === undefined) {
        currentPage = 1
      }
      elementsPerPage = 5;

      const startPageIndex = (currentPage - 1) * elementsPerPage;
      let endPageIndex = (currentPage * elementsPerPage);
      if (endPageIndex > subCommList.length) {
        endPageIndex = subCommList.length;
      }
      return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), subCommList.slice(startPageIndex, endPageIndex)));

    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule],
      declarations: [CommunityPageSubCommunityListComponent],
      providers: [
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageSubCommunityListComponent);
    comp = fixture.componentInstance;
    comp.community = mockCommunity;

  });

  it('should display a list of subCommunities', () => {
    subCommList = subcommunities;
    fixture.detectChanges();

    const subComList = fixture.debugElement.queryAll(By.css('li'));
    expect(subComList.length).toEqual(5);
    expect(subComList[0].nativeElement.textContent).toContain('SubCommunity 1');
    expect(subComList[1].nativeElement.textContent).toContain('SubCommunity 2');
    expect(subComList[2].nativeElement.textContent).toContain('SubCommunity 3');
    expect(subComList[3].nativeElement.textContent).toContain('SubCommunity 4');
    expect(subComList[4].nativeElement.textContent).toContain('SubCommunity 5');
  });

  it('should not display the header when subCommunities are empty', () => {
    subCommList = [];
    fixture.detectChanges();

    const subComHead = fixture.debugElement.queryAll(By.css('h2'));
    expect(subComHead.length).toEqual(0);
  });

  it('should update list of collection on pagination change', () => {
    subCommList = subcommunities;
    fixture.detectChanges();

    const pagination = Object.create({});
    pagination.pageId = comp.pageId;
    pagination.page = 2;
    pagination.pageSize = 5;
    pagination.sortField = 'dc.title';
    pagination.sortDirection = 'ASC';
    comp.onPaginationChange(pagination);
    fixture.detectChanges();

    const collList = fixture.debugElement.queryAll(By.css('li'));
    expect(collList.length).toEqual(2);
    expect(collList[0].nativeElement.textContent).toContain('SubCommunity 6');
    expect(collList[1].nativeElement.textContent).toContain('SubCommunity 7');
  });
});
