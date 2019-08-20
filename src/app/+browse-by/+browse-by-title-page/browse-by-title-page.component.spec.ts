import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../../core/shared/item.model';
import { ActivatedRouteStub } from '../../shared/testing/active-router-stub';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnumKeysPipe } from '../../shared/utils/enum-keys-pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { toRemoteData } from '../+browse-by-metadata-page/browse-by-metadata-page.component.spec';
import { BrowseByTitlePageComponent } from './browse-by-title-page.component';
import { ItemDataService } from '../../core/data/item-data.service';
import { Community } from '../../core/shared/community.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { BrowseService } from '../../core/browse/browse.service';
import { MockRouter } from '../../shared/mocks/mock-router';
import { createSuccessfulRemoteDataObject$ } from '../../shared/testing/utils';

describe('BrowseByTitlePageComponent', () => {
  let comp: BrowseByTitlePageComponent;
  let fixture: ComponentFixture<BrowseByTitlePageComponent>;
  let itemDataService: ItemDataService;
  let route: ActivatedRoute;

  const mockCommunity = Object.assign(new Community(), {
    id: 'test-uuid',
    metadata: [
      {
        key: 'dc.title',
        value: 'test community'
      }
    ]
  });

  const mockItems = [
    Object.assign(new Item(), {
      id: 'fakeId',
      metadata: [
        {
          key: 'dc.title',
          value: 'Fake Title'
        }
      ]
    })
  ];

  const mockBrowseService = {
    getBrowseItemsFor: () => toRemoteData(mockItems),
    getBrowseEntriesFor: () => toRemoteData([])
  };

  const mockDsoService = {
    findById: () => createSuccessfulRemoteDataObject$(mockCommunity)
  };

  const activatedRouteStub = Object.assign(new ActivatedRouteStub(), {
    params: observableOf({}),
    data: observableOf({ metadata: 'title' })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule.forRoot()],
      declarations: [BrowseByTitlePageComponent, EnumKeysPipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BrowseService, useValue: mockBrowseService },
        { provide: DSpaceObjectDataService, useValue: mockDsoService },
        { provide: Router, useValue: new MockRouter() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByTitlePageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    itemDataService = (comp as any).itemDataService;
    route = (comp as any).route;
  });

  it('should initialize the list of items', () => {
    comp.items$.subscribe((result) => {
      expect(result.payload.page).toEqual(mockItems);
    });
  });
});
