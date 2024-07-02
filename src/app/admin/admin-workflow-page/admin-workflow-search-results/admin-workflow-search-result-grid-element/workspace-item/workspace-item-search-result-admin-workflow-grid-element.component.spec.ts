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

import { AuthService } from '../../../../../core/auth/auth.service';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../../../../core/data/feature-authorization/authorization-data.service';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { Item } from '../../../../../core/shared/item.model';
import { ListableModule } from '../../../../../core/shared/listable.module';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { SupervisionOrderDataService } from '../../../../../core/supervision-order/supervision-order-data.service';
import { DynamicComponentLoaderDirective } from '../../../../../shared/abstract-component-loader/dynamic-component-loader.directive';
import { AuthServiceMock } from '../../../../../shared/mocks/auth.service.mock';
import { getMockLinkService } from '../../../../../shared/mocks/link-service.mock';
import { getMockThemeService } from '../../../../../shared/mocks/theme-service.mock';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import { CollectionElementLinkType } from '../../../../../shared/object-collection/collection-element-link.type';
import { WorkflowItemSearchResult } from '../../../../../shared/object-collection/shared/workflow-item-search-result.model';
import { ItemGridElementComponent } from '../../../../../shared/object-grid/item-grid-element/item-types/item/item-grid-element.component';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../../../shared/testing/notifications-service.stub';
import {
  supervisionOrderPaginatedListRD,
  supervisionOrderPaginatedListRD$,
} from '../../../../../shared/testing/supervision-order.mock';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { WorkspaceItemSearchResultAdminWorkflowGridElementComponent } from './workspace-item-search-result-admin-workflow-grid-element.component';

describe('WorkspaceItemSearchResultAdminWorkflowGridElementComponent', () => {
  let component: WorkspaceItemSearchResultAdminWorkflowGridElementComponent;
  let fixture: ComponentFixture<WorkspaceItemSearchResultAdminWorkflowGridElementComponent>;
  let id;
  let wfi;
  let itemRD$;
  let linkService;
  let object;
  let themeService: ThemeService;
  let supervisionOrderDataService;

  function init() {
    itemRD$ = createSuccessfulRemoteDataObject$(new Item());
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    object = new WorkflowItemSearchResult();
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    object.indexableObject = wfi;
    linkService = getMockLinkService();
    themeService = getMockThemeService();
    supervisionOrderDataService = jasmine.createSpyObj('supervisionOrderDataService', {
      searchByItem: jasmine.createSpy('searchByItem'),
      delete: jasmine.createSpy('delete'),
    });
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule(
      {
        imports: [
          WorkspaceItemSearchResultAdminWorkflowGridElementComponent,
          ItemGridElementComponent,
          DynamicComponentLoaderDirective,
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          ListableModule,
          WorkspaceItemSearchResultAdminWorkflowGridElementComponent,
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
          { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
          { provide: NotificationsService, useValue: new NotificationsServiceStub() },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: AuthorizationDataService, useValue: {} },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    linkService.resolveLink.and.callFake((a) => a);
    fixture = TestBed.createComponent(WorkspaceItemSearchResultAdminWorkflowGridElementComponent);
    component = fixture.componentInstance;
    component.object = object;
    component.linkTypes = CollectionElementLinkType;
    component.index = 0;
    component.viewModes = ViewMode;
    supervisionOrderDataService.searchByItem.and.returnValue(supervisionOrderPaginatedListRD$);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the item using the link service', () => {
    expect(linkService.resolveLink).toHaveBeenCalledWith(wfi, followLink('item'));
  });

  it('should retrieve supervision order objects properly', () => {
    expect(component.supervisionOrder$.value).toEqual(supervisionOrderPaginatedListRD.payload.page);
  });

  it('should emit reloadedObject properly ', () => {
    spyOn(component.reloadedObject, 'emit');
    const dso = new DSpaceObject();
    component.reloadObject(dso);
    expect(component.reloadedObject.emit).toHaveBeenCalledWith(dso);
  });
});
