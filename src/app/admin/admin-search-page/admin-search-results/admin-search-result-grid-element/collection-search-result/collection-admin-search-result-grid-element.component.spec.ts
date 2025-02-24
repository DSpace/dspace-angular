import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthorizationDataService,
  AuthorizationDataServiceStub,
  AuthService,
  AuthServiceStub,
  BitstreamDataService,
  Collection,
  CollectionSearchResult,
  FileService,
  FileServiceStub,
  LinkService,
  ViewMode,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';

import { getCollectionEditRoute } from '../../../../../collection-page/collection-page-routing-paths';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CollectionAdminSearchResultGridElementComponent } from './collection-admin-search-result-grid-element.component';

describe('CollectionAdminSearchResultGridElementComponent', () => {
  let component: CollectionAdminSearchResultGridElementComponent;
  let fixture: ComponentFixture<CollectionAdminSearchResultGridElementComponent>;
  let id;
  let searchResult;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new CollectionSearchResult();
    searchResult.indexableObject = new Collection();
    searchResult.indexableObject.uuid = id;
  }

  const linkService = jasmine.createSpyObj('linkService', {
    resolveLink: {},
  });

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        CollectionAdminSearchResultGridElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: BitstreamDataService, useValue: {} },
        { provide: LinkService, useValue: linkService },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: FileService, useClass: FileServiceStub },
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAdminSearchResultGridElementComponent);
    component = fixture.componentInstance;
    component.object = searchResult;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an edit button with the correct link', () => {
    const a = fixture.debugElement.query(By.css('a.edit-link'));
    const link = a.nativeElement.href;
    expect(link).toContain(getCollectionEditRoute(id));
  });
});
