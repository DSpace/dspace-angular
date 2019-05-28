import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { of as observableOf } from 'rxjs';

import { Item } from '../../../../core/shared/item.model';
import { PoolMyDSpaceResultDetailElementComponent } from './pool-my-dspace-result-detail-lement.component';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';

let component: PoolMyDSpaceResultDetailElementComponent;
let fixture: ComponentFixture<PoolMyDSpaceResultDetailElementComponent>;

const compIndex = 1;

const mockResultObject: PoolTaskMyDSpaceResult = new PoolTaskMyDSpaceResult();
mockResultObject.hitHighlights = {};

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
const rdItem = new RemoteData(false, false, true, null, item);
const workflowitem = Object.assign(new Workflowitem(), { item: observableOf(rdItem) });
const rdWorkflowitem = new RemoteData(false, false, true, null, workflowitem);
mockResultObject.indexableObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem) });

describe('PoolMyDSpaceResultDetailElementComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [PoolMyDSpaceResultDetailElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockResultObject) },
        { provide: 'indexElementProvider', useValue: (compIndex) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(PoolMyDSpaceResultDetailElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PoolMyDSpaceResultDetailElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init item properly', () => {
    expect(component.workflowitem).toEqual(workflowitem);
  });

  it('should have properly status', () => {
    expect(component.status).toEqual(MyDspaceItemStatusType.WAITING_CONTROLLER);
  });
});
