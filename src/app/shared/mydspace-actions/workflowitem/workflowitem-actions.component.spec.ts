import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { MockTranslateLoader } from '../../mocks/mock-translate-loader';
import { RouterStub } from '../../testing/router-stub';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { WorkflowItem } from '../../../core/submission/models/workflowitem.model';
import { WorkflowitemActionsComponent } from './workflowitem-actions.component';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service-stub';
import { createSuccessfulRemoteDataObject } from '../../testing/utils';

let component: WorkflowitemActionsComponent;
let fixture: ComponentFixture<WorkflowitemActionsComponent>;

let mockObject: WorkflowItem;

const mockDataService = {};

const item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ]
  }
});
const rd = createSuccessfulRemoteDataObject(item);
mockObject = Object.assign(new WorkflowItem(), { item: observableOf(rd), id: '1234', uuid: '1234' });

describe('WorkflowitemActionsComponent', () => {
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
      declarations: [WorkflowitemActionsComponent],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: Router, useValue: new RouterStub() },
        { provide: WorkflowItemDataService, useValue: mockDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(WorkflowitemActionsComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowitemActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
  });

  it('should init object properly', () => {
    component.initObjects(mockObject);

    expect(component.object).toEqual(mockObject);
  });

});
