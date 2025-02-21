import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { RemoteData } from '../../../../../../../modules/core/src/lib/core/data/remote-data';
import { RequestEntryState } from '../../../../../../../modules/core/src/lib/core/data/request-entry-state.model';
import { Item } from '../../../../../../../modules/core/src/lib/core/shared/item.model';
import { WorkflowItem } from '../../../../../../../modules/core/src/lib/core/submission/models/workflowitem.model';
import { URLCombiner } from '../../../../../../../modules/core/src/lib/core/url-combiner/url-combiner';
import {
  getWorkflowItemDeleteRoute,
  getWorkflowItemSendBackRoute,
} from '../../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import { WorkflowItemAdminWorkflowActionsComponent } from './workflow-item-admin-workflow-actions.component';

describe('WorkflowItemAdminWorkflowActionsComponent', () => {
  let component: WorkflowItemAdminWorkflowActionsComponent;
  let fixture: ComponentFixture<WorkflowItemAdminWorkflowActionsComponent>;
  let id;
  let wfi;
  let item = new Item();
  item.uuid = 'itemUUID1111';
  const rd = new RemoteData(undefined, undefined, undefined, RequestEntryState.Success, undefined, item, 200);

  function init() {
    id = '780b2588-bda5-4112-a1cd-0b15000a5339';
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
        WorkflowItemAdminWorkflowActionsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
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
