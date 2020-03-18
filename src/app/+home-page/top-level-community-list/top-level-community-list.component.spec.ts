import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TopLevelCommunityListComponent } from './top-level-community-list.component';
import { Community } from '../../core/shared/community.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { PageInfo } from '../../core/shared/page-info.model';
import { SharedModule } from '../../shared/shared.module';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { FindListOptions } from '../../core/data/request.models';
import { HostWindowService } from '../../shared/host-window.service';
import { HostWindowServiceStub } from '../../shared/testing/host-window-service.stub';
import { CommunityDataService } from '../../core/data/community-data.service';
import { SelectableListService } from '../../shared/object-list/selectable-list/selectable-list.service';

describe('TopLevelCommunityList Component', () => {
  let comp: TopLevelCommunityListComponent;
  let fixture: ComponentFixture<TopLevelCommunityListComponent>;
  let communityDataServiceStub: any;

  const topCommList = [Object.assign(new Community(), {
    id: '123456789-1',
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'TopCommunity 1' }
      ]
    }
  }),
    Object.assign(new Community(), {
      id: '123456789-2',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 2' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-3',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 3' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '12345678942',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 4' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-5',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 5' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-6',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 6' }
        ]
      }
    }),
    Object.assign(new Community(), {
      id: '123456789-7',
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'TopCommunity 7' }
        ]
      }
    })
  ];

  communityDataServiceStub = {
    findTop(options: FindListOptions = {}) {
      let currentPage = options.currentPage;
      let elementsPerPage = options.elementsPerPage;
      if (currentPage === undefined) {
        currentPage = 1
      }
      elementsPerPage = 5;

      const startPageIndex = (currentPage - 1) * elementsPerPage;
      let endPageIndex = (currentPage * elementsPerPage);
      if (endPageIndex > topCommList.length) {
        endPageIndex = topCommList.length;
      }
      return createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), topCommList.slice(startPageIndex, endPageIndex)));

    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SharedModule,
        RouterTestingModule.withRoutes([]),
        NgbModule,
        NoopAnimationsModule
      ],
      declarations: [TopLevelCommunityListComponent],
      providers: [
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: SelectableListService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopLevelCommunityListComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should display a list of top-communities', () => {
    const subComList = fixture.debugElement.queryAll(By.css('li'));

    expect(subComList.length).toEqual(5);
    expect(subComList[0].nativeElement.textContent).toContain('TopCommunity 1');
    expect(subComList[1].nativeElement.textContent).toContain('TopCommunity 2');
    expect(subComList[2].nativeElement.textContent).toContain('TopCommunity 3');
    expect(subComList[3].nativeElement.textContent).toContain('TopCommunity 4');
    expect(subComList[4].nativeElement.textContent).toContain('TopCommunity 5');
  });

  it('should update list of top-communities on pagination change', () => {
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
    expect(collList[0].nativeElement.textContent).toContain('TopCommunity 6');
    expect(collList[1].nativeElement.textContent).toContain('TopCommunity 7');
  });
});
