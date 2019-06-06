import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';

import { RemoteData } from '../../../../core/data/remote-data';
import { ItemSubmitterComponent } from './item-submitter.component';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { EPersonMock } from '../../../testing/eperson-mock';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { By } from '@angular/platform-browser';

let component: ItemSubmitterComponent;
let fixture: ComponentFixture<ItemSubmitterComponent>;

const compIndex = 1;

let mockResultObject: PoolTask;

const rdSumbitter = new RemoteData(false, false, true, null, EPersonMock);
const workflowitem = Object.assign(new Workflowitem(), { submitter: observableOf(rdSumbitter) });
const rdWorkflowitem = new RemoteData(false, false, true, null, workflowitem);
mockResultObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem) });

describe('ItemSubmitterComponent', () => {
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
      declarations: [ItemSubmitterComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ItemSubmitterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ItemSubmitterComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.object = mockResultObject;
    fixture.detectChanges();
  });

  it('should init submitter properly', () => {
    expect(component.submitter$).toBeObservable(cold('(b|)', {
      b: EPersonMock
    }));
  });

  it('should show a badge with submitter name', () => {
    const badge = fixture.debugElement.query(By.css('.badge'));

    expect(badge).toBeDefined();
    expect(badge.nativeElement.innerHTML).toBe(EPersonMock.name);
  });
});
