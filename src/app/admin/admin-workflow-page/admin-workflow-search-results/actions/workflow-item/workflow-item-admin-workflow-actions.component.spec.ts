import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import {
  Angulartics2,
  RouterlessTracking,
} from 'angulartics2';
import { of } from 'rxjs';

import {
  APP_CONFIG,
  APP_DATA_SERVICES_MAP,
} from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { ObjectCacheService } from '../../../../../core/cache/object-cache.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { RequestService } from '../../../../../core/data/request.service';
import { RequestEntryState } from '../../../../../core/data/request-entry-state.model';
import { Item } from '../../../../../core/shared/item.model';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { ClaimedTaskDataService } from '../../../../../core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../../../../core/tasks/pool-task-data.service';
import { URLCombiner } from '../../../../../core/url-combiner/url-combiner';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import {
  getWorkflowItemDeleteRoute,
  getWorkflowItemSendBackRoute,
} from '../../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import { WorkflowItemAdminWorkflowActionsComponent } from './workflow-item-admin-workflow-actions.component';

describe('WorkflowItemAdminWorkflowActionsComponent', () => {
  let component: WorkflowItemAdminWorkflowActionsComponent;
  let fixture: ComponentFixture<WorkflowItemAdminWorkflowActionsComponent>;
  let id: string;
  let wfi: WorkflowItem;
  let item: Item;
  let rd: RemoteData<Item>;

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
    item = new Item();
    item.uuid = 'itemUUID1111';
    rd = new RemoteData(undefined, undefined, undefined, RequestEntryState.Success, undefined, item, 200);
    wfi = new WorkflowItem();
    wfi.id = id;
    wfi.item = of(rd);
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        StoreModule.forRoot({}),
        WorkflowItemAdminWorkflowActionsComponent,
      ],
      providers: [
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        { provide: APP_CONFIG, useValue: environment },
        { provide: RouterlessTracking, useValue: { trackLocation: () => {} } },
        { provide: Angulartics2, useValue: { startTracking: () => {} } },
        NotificationsService,
        LinkService,
        RequestService,
        ObjectCacheService,
        SearchService,
        SearchConfigurationService,
        ClaimedTaskDataService,
        PoolTaskDataService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowItemAdminWorkflowActionsComponent);
    component = fixture.componentInstance;
    component.wfi = wfi;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a delete button with the correct link', () => {
    const button = fixture.debugElement.query(By.css('a.delete-link'));
    const link = button.nativeElement.href;
    expect(link).toContain(new URLCombiner(getWorkflowItemDeleteRoute(wfi.id)).toString());
  });

  it('should render a move button with the correct link', () => {
    const a = fixture.debugElement.query(By.css('a.send-back-link'));
    const link = a.nativeElement.href;
    expect(link).toContain(new URLCombiner(getWorkflowItemSendBackRoute(wfi.id)).toString());
  });
});
