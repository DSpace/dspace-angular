import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { RouterTestingModule } from '@angular/router/testing';
import {
  WorkflowItemSearchResultAdminWorkflowGridElementComponent
} from './workflow-item-search-result-admin-workflow-grid-element.component';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { Item } from '../../../../../core/shared/item.model';
import {
  ListableObjectDirective
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.directive';
import {
  WorkflowItemSearchResult
} from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { getMockLinkService } from '../../../../../shared/mocks/link-service.mock';
import { of as observableOf } from 'rxjs';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { AuthServiceMock } from '../../../../../shared/mocks/auth.service.mock';
import { AuthorizationDataServiceStub } from '../../../../../shared/testing/authorization-service.stub';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { ListableModule } from '../../../../../core/shared/listable.module';

describe('WorkflowItemSearchResultAdminWorkflowGridElementComponent', () => {
  let component: WorkflowItemSearchResultAdminWorkflowGridElementComponent;
  let fixture: ComponentFixture<WorkflowItemSearchResultAdminWorkflowGridElementComponent>;
  let id;
  let wfi;
  let itemRD$;
  let linkService;
  let object;
  let themeService;

  function init() {
    itemRD$ = createSuccessfulRemoteDataObject$(new Item());
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    object = new WorkflowItemSearchResult();
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    object.indexableObject = wfi;
    linkService = getMockLinkService();
    themeService = getMockThemeService();
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule(
      {
    imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ListableObjectDirective,
        ListableModule
    ],
    declarations: [WorkflowItemSearchResultAdminWorkflowGridElementComponent],
    providers: [
        { provide: LinkService, useValue: linkService },
        { provide: ThemeService, useValue: themeService },
        {
            provide: TruncatableService, useValue: {
                isCollapsed: () => observableOf(true),
            }
        },
        { provide: BitstreamDataService, useValue: {} },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
      .compileComponents();
  }));

  beforeEach(() => {
    linkService.resolveLink.and.callFake((a) => a);
    fixture = TestBed.createComponent(WorkflowItemSearchResultAdminWorkflowGridElementComponent);
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
