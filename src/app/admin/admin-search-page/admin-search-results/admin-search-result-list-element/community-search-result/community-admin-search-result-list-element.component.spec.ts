import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { Community } from '@dspace/core/shared/community.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../../environments/environment';
import { getCommunityEditRoute } from '../../../../../community-page/community-page-routing-paths';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { CommunitySearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/community-search-result/community-search-result-list-element.component';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CommunityAdminSearchResultListElementComponent } from './community-admin-search-result-list-element.component';

describe('CommunityAdminSearchResultListElementComponent', () => {
  let component: CommunityAdminSearchResultListElementComponent;
  let fixture: ComponentFixture<CommunityAdminSearchResultListElementComponent>;
  let id;
  let searchResult;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    searchResult = new CommunitySearchResult();
    searchResult.indexableObject = new Community();
    searchResult.indexableObject.uuid = id;
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        CommunityAdminSearchResultListElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CommunityAdminSearchResultListElementComponent, {
        remove: {
          imports: [CommunitySearchResultListElementComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAdminSearchResultListElementComponent);
    component = fixture.componentInstance;
    component.object = searchResult;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an edit button with the correct link', () => {
    const a = fixture.debugElement.query(By.css('a'));
    const link = a.nativeElement.href;
    expect(link).toContain(getCommunityEditRoute(id));
  });
});
