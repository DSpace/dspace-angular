import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { AuthService } from '../../../../../../../modules/core/src/lib/core/auth/auth.service';
import { LinkService } from '../../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { BitstreamDataService } from '../../../../../../../modules/core/src/lib/core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../../../../../../modules/core/src/lib/core/data/feature-authorization/authorization-data.service';
import { CommunitySearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/community-search-result.model';
import { Community } from '../../../../../../../modules/core/src/lib/core/shared/community.model';
import { FileService } from '../../../../../../../modules/core/src/lib/core/shared/file.service';
import { ViewMode } from '../../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { AuthServiceStub } from '../../../../../../../modules/core/src/lib/core/utilities/testing/auth-service.stub';
import { AuthorizationDataServiceStub } from '../../../../../../../modules/core/src/lib/core/utilities/testing/authorization-service.stub';
import { FileServiceStub } from '../../../../../../../modules/core/src/lib/core/utilities/testing/file-service.stub';
import { mockTruncatableService } from '../../../../../shared/mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CommunityAdminSearchResultGridElementComponent } from './community-admin-search-result-grid-element.component';

describe('CommunityAdminSearchResultGridElementComponent', () => {
  let component: CommunityAdminSearchResultGridElementComponent;
  let fixture: ComponentFixture<CommunityAdminSearchResultGridElementComponent>;
  let id;
  let searchResult;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new CommunitySearchResult();
    searchResult.indexableObject = new Community();
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
        CommunityAdminSearchResultGridElementComponent,
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
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAdminSearchResultGridElementComponent);
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
    expect(link).toContain(getCommunityEditRoute(id));
  });
});
