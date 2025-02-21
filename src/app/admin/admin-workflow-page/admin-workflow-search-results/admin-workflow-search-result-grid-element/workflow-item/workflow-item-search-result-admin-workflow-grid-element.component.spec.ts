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

import { AuthService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import { BitstreamDataService } from '@dspace/core';
import { AuthorizationDataService } from '@dspace/core';
import { followLink } from '@dspace/core';
import { getMockLinkService } from '@dspace/core';
import { WorkflowItemSearchResult } from '@dspace/core';
import { Item } from '@dspace/core';
import { ViewMode } from '@dspace/core';
import { WorkflowItem } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { AuthorizationDataServiceStub } from '@dspace/core';
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
