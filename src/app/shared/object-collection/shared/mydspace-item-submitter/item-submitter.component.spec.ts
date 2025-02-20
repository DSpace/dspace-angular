import {
  ChangeDetectionStrategy,
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { cold } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { LinkService } from '../../../../core/cache/builders/link.service';
import { getMockLinkService } from '../../../../core/mocks/link-service.mock';
import { TranslateLoaderMock } from '../../../../core/mocks/translate-loader.mock';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { createSuccessfulRemoteDataObject } from '../../../../core/utilities/remote-data.utils';
import { EPersonMock } from '../../../../core/utilities/testing/eperson.mock';
import { ItemSubmitterComponent } from './item-submitter.component';

let component: ItemSubmitterComponent;
let fixture: ComponentFixture<ItemSubmitterComponent>;
let mockResultObject: PoolTask;

const rdSumbitter = createSuccessfulRemoteDataObject(EPersonMock);
const workflowitem = Object.assign(new WorkflowItem(), { submitter: observableOf(rdSumbitter) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject = Object.assign(new PoolTask(), { workflowitem: observableOf(rdWorkflowitem) });

describe('ItemSubmitterComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ItemSubmitterComponent,
      ],
      providers: [
        { provide: LinkService, useValue: getMockLinkService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemSubmitterComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemSubmitterComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.object = mockResultObject;
    fixture.detectChanges();
  });

  it('should init submitter properly', () => {
    expect(component.submitter$).toBeObservable(cold('(b|)', {
      b: EPersonMock,
    }));
  });

  it('should show N/A when submitter is null', () => {
    component.submitter$ = observableOf(null);
    fixture.detectChanges();

    const badge: DebugElement = fixture.debugElement.query(By.css('.badge'));

    expect(badge.nativeElement.innerText).toBe('submitter.empty');
  });

  it('should show a badge with submitter name', () => {
    const badge: DebugElement = fixture.debugElement.query(By.css('.badge'));

    expect(badge.nativeElement.innerText).toBe(EPersonMock.name);
  });
});
