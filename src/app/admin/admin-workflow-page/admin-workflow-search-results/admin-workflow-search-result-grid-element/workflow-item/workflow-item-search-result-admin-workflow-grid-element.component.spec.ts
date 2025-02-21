import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../../../../../../modules/core/src/lib/core/auth/auth.service';
import { LinkService } from '../../../../../../../modules/core/src/lib/core/cache/builders/link.service';
import { BitstreamDataService } from '../../../../../../../modules/core/src/lib/core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../../../../../../modules/core/src/lib/core/data/feature-authorization/authorization-data.service';
import { followLink } from '../../../../../../../modules/core/src/lib/core/data/follow-link-config.model';
import { getMockLinkService } from '../../../../../../../modules/core/src/lib/core/mocks/link-service.mock';
import { WorkflowItemSearchResult } from '../../../../../../../modules/core/src/lib/core/object-collection/workflow-item-search-result.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { ViewMode } from '../../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { WorkflowItem } from '../../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { AuthorizationDataServiceStub } from '../../../../../../../modules/core/src/lib/core/utilities/testing/authorization-service.stub';
import { DynamicComponentLoaderDirective } from '../../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { AuthServiceMock } from '../../../../../shared/mocks/auth.service.mock';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { ListableModule } from '../../../../../shared/modules/listable.module';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { ItemGridElementComponent } from '../../../../../shared/object-grid/item-grid-element/item-types/item/item-grid-element.component';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { WorkflowItemSearchResultAdminWorkflowGridElementComponent } from './workflow-item-search-result-admin-workflow-grid-element.component';

describe('WorkflowItemSearchResultAdminWorkflowGridElementComponent', () => {
  let component: WorkflowItemSearchResultAdminWorkflowGridElementComponent;
  let fixture: ComponentFixture<WorkflowItemSearchResultAdminWorkflowGridElementComponent>;
  let id;
  let wfi;
  let itemRD$;
  let linkService;
  let object;
  let themeService: ThemeService;

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
          WorkflowItemSearchResultAdminWorkflowGridElementComponent,
          ItemGridElementComponent,
          DynamicComponentLoaderDirective,
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          ListableModule,
          WorkflowItemSearchResultAdminWorkflowGridElementComponent,
        ],
        providers: [
          { provide: LinkService, useValue: linkService },
          { provide: ThemeService, useValue: themeService },
          {
            provide: TruncatableService, useValue: {
              isCollapsed: () => observableOf(true),
            },
          },
          { provide: BitstreamDataService, useValue: {} },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: AuthorizationDataService, useClass: AuthorizationDataServiceStub },
        ],
        schemas: [NO_ERRORS_SCHEMA],
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
