import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { RemoteData } from '../../../../core/data/remote-data';

import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { EPersonMock } from '../../../testing/eperson-mock';
import { MyDSpaceItemStatusComponent } from './my-dspace-item-status.component';
import { MyDspaceItemStatusType } from './my-dspace-item-status-type';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { By } from '@angular/platform-browser';

let component: MyDSpaceItemStatusComponent;
let fixture: ComponentFixture<MyDSpaceItemStatusComponent>;

let mockResultObject: PoolTask;

const rdSumbitter = new RemoteData(false, false, true, null, EPersonMock);
const workflowitem = Object.assign(new Workflowitem(), { submitter: observableOf(rdSumbitter) });
const rdWorkflowitem = new RemoteData(false, false, true, null, workflowitem);
mockResultObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem) });

describe('MyDSpaceItemStatusComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })
      ],
      declarations: [MyDSpaceItemStatusComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(MyDSpaceItemStatusComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpaceItemStatusComponent);
    component = fixture.componentInstance;
  });

  it('should display badge', () => {
    const badge = fixture.debugElement.query(By.css('span'));
    expect(badge).toBeDefined();
  });

  it('should init badge content and class', () => {
    component.status = MyDspaceItemStatusType.VALIDATION;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(MyDspaceItemStatusType.VALIDATION);
    expect(component.badgeClass).toBe('text-light badge badge-warning');
  });

  it('should init badge content and class', () => {
    component.status = MyDspaceItemStatusType.WAITING_CONTROLLER;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(MyDspaceItemStatusType.WAITING_CONTROLLER);
    expect(component.badgeClass).toBe('text-light badge badge-info');
  });

  it('should init badge content and class', () => {
    component.status = MyDspaceItemStatusType.WORKSPACE;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(MyDspaceItemStatusType.WORKSPACE);
    expect(component.badgeClass).toBe('text-light badge badge-primary');
  });

  it('should init badge content and class', () => {
    component.status = MyDspaceItemStatusType.ARCHIVED;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(MyDspaceItemStatusType.ARCHIVED);
    expect(component.badgeClass).toBe('text-light badge badge-success');
  });

  it('should init badge content and class', () => {
    component.status = MyDspaceItemStatusType.WORKFLOW;
    fixture.detectChanges();
    expect(component.badgeContent).toBe(MyDspaceItemStatusType.WORKFLOW);
    expect(component.badgeClass).toBe('text-light badge badge-info');
  });
});
