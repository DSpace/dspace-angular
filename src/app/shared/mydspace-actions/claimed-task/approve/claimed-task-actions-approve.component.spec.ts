import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ClaimedTaskActionsApproveComponent } from './claimed-task-actions-approve.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';

let component: ClaimedTaskActionsApproveComponent;
let fixture: ComponentFixture<ClaimedTaskActionsApproveComponent>;

describe('ClaimedTaskActionsApproveComponent', () => {
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });
  const claimedTaskService = jasmine.createSpyObj('claimedTaskService', {
    submitTask: observableOf(new ProcessTaskResponse(true))
  });

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
      providers: [
        { provide: ClaimedTaskDataService, useValue: claimedTaskService }
      ],
      declarations: [ClaimedTaskActionsApproveComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsApproveComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsApproveComponent);
    component = fixture.componentInstance;
    component.object = object;
    fixture.detectChanges();
  });

  it('should display approve button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-success'));

    expect(btn).toBeDefined();
  });

  it('should display spin icon when approve is pending', () => {
    component.processing$.next(true);
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-success .fa-spin'));

    expect(span).toBeDefined();
  });

  describe('submitTask', () => {
    let expectedBody;

    beforeEach(() => {
      spyOn(component.processCompleted, 'emit');

      expectedBody = {
        [component.option]: 'true'
      };

      component.submitTask();
      fixture.detectChanges();
    });

    it('should call claimedTaskService\'s submitTask with the expected body', () => {
      expect(claimedTaskService.submitTask).toHaveBeenCalledWith(object.id, expectedBody)
    });

    it('should emit a successful processCompleted event', () => {
      expect(component.processCompleted.emit).toHaveBeenCalledWith(true);
    });
  });

});
