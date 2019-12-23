import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommunityPageSubCollectionListComponent } from './community-page-sub-collection-list.component';
import { Community } from '../../core/shared/community.model';
import { SharedModule } from '../../shared/shared.module';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { FindListOptions } from '../../core/data/request.models';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service-stub';
import { SelectableListService } from '../../shared/object-list/selectable-list/selectable-list.service';

describe('CommunityPageSubCollectionList Component', () => {
  let comp: CommunityPageSubCollectionListComponent;
  let fixture: ComponentFixture<CommunityPageSubCollectionListComponent>;
  let collectionDataServiceStub: any;
  let subCollList = [];

  const collections = [Object.assign(new Community(), {
    id: '123456789-1',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Collection 1' }
      ]
    }
  }),
    Object.assign(new Community(), {
      id: '123456789-2',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Collection 2' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-3',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Collection 3' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-4',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Collection 4' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-5',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Collection 5' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-6',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Collection 6' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-7',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Collection 7' }
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

  collectionDataServiceStub = {
    findByParent(parentUUID: string, options: FindListOptions = {}) {
      let currentPage = options.currentPage;
      let elementsPerPage = options.elementsPerPage;
      if (currentPage === undefined) {
        currentPage = 1
      }
      elementsPerPage = 5;
      const startPageIndex = (currentPage - 1) * elementsPerPage;
      let endPageIndex = (currentPage * elementsPerPage);
      if (endPageIndex > subCollList.length) {
        endPageIndex = subCollList.length;
      }
      return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), subCollList.slice(startPageIndex, endPageIndex)));

    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        RouterTestingModule.withRoutes([]),
        NgbModule.forRoot(),
        NoopAnimationsModule
      ],
      declarations: [CommunityPageSubCollectionListComponent],
      providers: [
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: SelectableListService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageSubCollectionListComponent);
    comp = fixture.componentInstance;
    comp.community = mockCommunity;
  });

  it('should display a list of collections', () => {
    subCollList = collections;
    fixture.detectChanges();

    const collList = fixture.debugElement.queryAll(By.css('li'));
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

  it('should update list of collections on pagination change', () => {
    subCollList = collections;
    fixture.detectChanges();

    const pagination = Object.create({
      pagination:{
        id: comp.pageId,
        currentPage: 2,
        pageSize: 5
      },
      sort: {
        field: 'dc.title',
        direction: 'ASC'
      }
    });
    comp.onPaginationChange(pagination);
    fixture.detectChanges();

    const collList = fixture.debugElement.queryAll(By.css('li'));
    expect(collList.length).toEqual(2);
    expect(collList[0].nativeElement.textContent).toContain('Collection 6');
    expect(collList[1].nativeElement.textContent).toContain('Collection 7');
  });
});
