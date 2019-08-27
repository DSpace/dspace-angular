import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TranslateModule} from '@ngx-translate/core';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CommunityPageSubCommunityListComponent} from './community-page-sub-community-list.component';
import {Community} from '../../core/shared/community.model';
import {RemoteData} from '../../core/data/remote-data';
import {PaginatedList} from '../../core/data/paginated-list';
import {PageInfo} from '../../core/shared/page-info.model';
import {SharedModule} from '../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {of as observableOf,  Observable } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';

describe('SubCommunityList Component', () => {
  let comp: CommunityPageSubCommunityListComponent;
  let fixture: ComponentFixture<CommunityPageSubCommunityListComponent>;

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
    })
  ];

  const emptySubCommunitiesCommunity = Object.assign(new Community(), {
    metadata: {
      'dc.title': [
        { language: 'en_US', value: 'Test title' }
      ]
    },
    subcommunities: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), []))
  });

  const mockCommunity = Object.assign(new Community(), {
      metadata: {
        'dc.title': [
          { language: 'en_US', value: 'Test title' }
        ]
      },
      subcommunities: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), subcommunities))
    })
  ;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule,
        RouterTestingModule.withRoutes([]),
        NoopAnimationsModule],
      declarations: [CommunityPageSubCommunityListComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageSubCommunityListComponent);
    comp = fixture.componentInstance;
  });

  it('should display a list of subCommunities', () => {
    comp.community = mockCommunity;
    fixture.detectChanges();

    const subComList = fixture.debugElement.queryAll(By.css('li'));
    expect(subComList.length).toEqual(2);
    expect(subComList[0].nativeElement.textContent).toContain('SubCommunity 1');
    expect(subComList[1].nativeElement.textContent).toContain('SubCommunity 2');
  });

  it('should not display the header when subCommunities are empty', () => {
    comp.community = emptySubCommunitiesCommunity;
    fixture.detectChanges();

    const subComHead = fixture.debugElement.queryAll(By.css('h2'));
    expect(subComHead.length).toEqual(0);
  });
});
