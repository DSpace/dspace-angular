import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../../core/tasks/models/pool-task-object.model';
import { EPersonMock } from '../../../../testing/eperson.mock';
import { MyDSpaceStatusBadgeComponent } from './my-dspace-status-badge.component';
import { TranslateLoaderMock } from '../../../../mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { createSuccessfulRemoteDataObject } from '../../../../remote-data.utils';
import { Context } from '../../../../../core/shared/context.model';

let component: MyDSpaceStatusBadgeComponent;
let fixture: ComponentFixture<MyDSpaceStatusBadgeComponent>;

let mockResultObject: PoolTask;

const rdSumbitter = createSuccessfulRemoteDataObject(EPersonMock);
const workflowitem = Object.assign(new WorkflowItem(), { submitter: observableOf(rdSumbitter) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem) });

describe('MyDSpaceItemStatusComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: TranslateLoaderMock
            }
        }),
        MyDSpaceStatusBadgeComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
}).overrideComponent(MyDSpaceStatusBadgeComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpaceStatusBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should display badge', () => {
    const badge = fixture.debugElement.query(By.css('span'));
    expect(badge).not.toBeNull();
  });

  it('should init badge content and class', () => {
    component.context = Context.MyDSpaceValidation;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(Context.MyDSpaceValidation);
    expect(component.badgeClass).toBe('text-light badge badge-validation');
  });

  it('should init badge content and class', () => {
    component.context = Context.MyDSpaceWaitingController;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(Context.MyDSpaceWaitingController);
    expect(component.badgeClass).toBe('text-light badge badge-waiting-controller');
  });

  it('should init badge content and class', () => {
    component.context = Context.MyDSpaceWorkspace;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(Context.MyDSpaceWorkspace);
    expect(component.badgeClass).toBe('text-light badge badge-workspace');
  });

  it('should init badge content and class', () => {
    component.context = Context.MyDSpaceArchived;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(Context.MyDSpaceArchived);
    expect(component.badgeClass).toBe('text-light badge badge-archived');
  });

  it('should init badge content and class', () => {
    component.context = Context.MyDSpaceWorkflow;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(Context.MyDSpaceWorkflow);
    expect(component.badgeClass).toBe('text-light badge badge-workflow');
  });
});
