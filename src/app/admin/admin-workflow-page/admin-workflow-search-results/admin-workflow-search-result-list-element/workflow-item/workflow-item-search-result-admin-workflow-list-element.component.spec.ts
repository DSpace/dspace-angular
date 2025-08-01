import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@config/app-config.interface';
import { AuthService } from '@core/auth/auth.service';
import { DSONameService } from '@core/breadcrumbs/dso-name.service';
import { LinkService } from '@core/cache/builders/link.service';
import { AuthorizationDataService } from '@core/data/feature-authorization/authorization-data.service';
import { followLink } from '@core/shared/follow-link-config.model';
import { Item } from '@core/shared/item.model';
import { ViewMode } from '@core/shared/view-mode.model';
import { WorkflowItem } from '@core/submission/models/workflowitem.model';
import { AuthServiceMock } from '@core/testing/auth.service.mock';
import { DSONameServiceMock } from '@core/testing/dso-name.service.mock';
import { getMockLinkService } from '@core/testing/link-service.mock';
import { mockTruncatableService } from '@core/testing/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '@core/utilities/remote-data.utils';
import { XSRFService } from '@core/xsrf/xsrf.service';
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../../environments/environment';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { WorkflowItemSearchResult } from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { getMockThemeService } from '../../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { WorkflowItemSearchResultAdminWorkflowListElementComponent } from './workflow-item-search-result-admin-workflow-list-element.component';

describe('WorkflowItemSearchResultAdminWorkflowListElementComponent', () => {
  let component: WorkflowItemSearchResultAdminWorkflowListElementComponent;
  let fixture: ComponentFixture<WorkflowItemSearchResultAdminWorkflowListElementComponent>;
  let id;
  let wfi;
  let itemRD$;
  let linkService;
  let object;

  function init() {
    itemRD$ = createSuccessfulRemoteDataObject$(new Item());
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    object = new WorkflowItemSearchResult();
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    object.indexableObject = wfi;
    linkService = getMockLinkService();
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule(
      {
        imports: [
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          WorkflowItemSearchResultAdminWorkflowListElementComponent,
        ],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: LinkService, useValue: linkService },
          { provide: DSONameService, useClass: DSONameServiceMock },
          { provide: APP_CONFIG, useValue: environment },
          { provide: ThemeService, useValue: getMockThemeService() },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: AuthorizationDataService, useValue: {} },
          { provide: XSRFService, useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    linkService.resolveLink.and.callFake((a) => a);
    fixture = TestBed.createComponent(WorkflowItemSearchResultAdminWorkflowListElementComponent);
    component = fixture.componentInstance;
    component.object = object;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the item using the link service', () => {
    expect(linkService.resolveLink).toHaveBeenCalledWith(wfi, followLink('item'));
  });
});
