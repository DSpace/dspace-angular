import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ClaimedTaskActionsReturnToPoolComponent } from './claimed-task-actions-return-to-pool.component';
import { MockTranslateLoader } from '../../../mocks/mock-translate-loader';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { ProcessTaskResponse } from '../../../../core/tasks/models/process-task-response';
import { ClaimedTaskDataService } from '../../../../core/tasks/claimed-task-data.service';

let component: ClaimedTaskActionsReturnToPoolComponent;
let fixture: ComponentFixture<ClaimedTaskActionsReturnToPoolComponent>;

describe('ClaimedTaskActionsReturnToPoolComponent', () => {
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });
  const claimedTaskService = jasmine.createSpyObj('claimedTaskService', {
    returnToPoolTask: observableOf(new ProcessTaskResponse(true))
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
      declarations: [ClaimedTaskActionsReturnToPoolComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(ClaimedTaskActionsReturnToPoolComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsReturnToPoolComponent);
    component = fixture.componentInstance;
    component.object = object;
    fixture.detectChanges();
  });

  it('should display return to pool button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-secondary'));

    expect(btn).toBeDefined();
  });

  it('should display spin icon when return to pool action is pending', () => {
    component.processing$.next(true);
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-secondary .fa-spin'));

    expect(span).toBeDefined();
  });

  it('should emit a successful processCompleted event', () => {
    spyOn(component.processCompleted, 'emit');

    component.process();
    fixture.detectChanges();

    expect(component.processCompleted.emit).toHaveBeenCalled();
  });

});
