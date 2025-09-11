import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config';
import {
  AuthService,
  DSONameService,
  LinkService,
  AuthorizationDataService,
  NotificationsService,
  DSpaceObject,
  followLink,
  Item,
  WorkflowItemSearchResult,
  ViewMode,
  WorkflowItem,
  SupervisionOrderDataService,
  AuthServiceMock,
  DSONameServiceMock,
  getMockLinkService,
  mockTruncatableService,
  NotificationsServiceStub,
  supervisionOrderPaginatedListRD,
  supervisionOrderPaginatedListRD$,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core'
import { TranslateModule } from '@ngx-translate/core';

import { environment } from '../../../../../../environments/environment';
import {
  CollectionElementLinkType,
} from '../../../../../shared/object-collection/collection-element-link.type';
import { getMockThemeService } from '../../../../../shared/theme-support/test/theme-service.mock';
import { ThemeService } from '../../../../../shared/theme-support/theme.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import {
  WorkspaceItemSearchResultAdminWorkflowListElementComponent,
} from './workspace-item-search-result-admin-workflow-list-element.component';

describe('WorkspaceItemSearchResultAdminWorkflowListElementComponent', () => {
  let component: WorkspaceItemSearchResultAdminWorkflowListElementComponent;
  let fixture: ComponentFixture<WorkspaceItemSearchResultAdminWorkflowListElementComponent>;
  let id;
  let wfi;
  let itemRD$;
  let linkService;
  let object;
  let supervisionOrderDataService;

  function init() {
    itemRD$ = createSuccessfulRemoteDataObject$(new Item());
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    object = new WorkflowItemSearchResult();
    wfi = new WorkflowItem();
    wfi.item = itemRD$;
    object.indexableObject = wfi;
    linkService = getMockLinkService();
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
          NoopAnimationsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
          WorkspaceItemSearchResultAdminWorkflowListElementComponent,
        ],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: NotificationsService, useValue: new NotificationsServiceStub() },
          { provide: ThemeService, useValue: getMockThemeService() },
          { provide: AuthService, useValue: new AuthServiceMock() },
          { provide: LinkService, useValue: linkService },
          { provide: DSONameService, useClass: DSONameServiceMock },
          { provide: AuthorizationDataService, useValue: {} },
          { provide: SupervisionOrderDataService, useValue: supervisionOrderDataService },
          { provide: APP_CONFIG, useValue: environment },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    linkService.resolveLink.and.callFake((a) => a);
    fixture = TestBed.createComponent(WorkspaceItemSearchResultAdminWorkflowListElementComponent);
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
