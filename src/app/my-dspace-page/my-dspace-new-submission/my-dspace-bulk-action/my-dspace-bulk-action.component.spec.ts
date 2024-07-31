import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { MyDSpaceBulkActionComponent } from './my-dspace-bulk-action.component';
import { SearchService } from '../../../core/shared/search/search.service';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { Router } from '@angular/router';
import { RouterStub } from '../../../shared/testing/router.stub';
import { SearchServiceStub } from '../../../shared/testing/search-service.stub';
import { UntypedFormBuilder } from '@angular/forms';
import { RequestService } from '../../../core/data/request.service';
import { By } from '@angular/platform-browser';

describe('MyDSpaceBulkActionComponent test suite', () => {
  let comp: MyDSpaceBulkActionComponent;
  let fixture: ComponentFixture<MyDSpaceBulkActionComponent>;

  const testAction = {
    _embedded: {
      indexableObject: {
        type: ''
      }
    }
  };

  const selectableListService = jasmine.createSpyObj('selectableListService', {
    getSelectableList: of({selection: []}),
    deselectAll: jasmine.createSpy('deselectAll')
  });

  const poolTaskService = new PoolTaskDataService(null, null, null, null);

  const claimedTaskService = jasmine.createSpyObj('claimedTaskService', {
    submitTask: of(new ProcessTaskResponse(true))
  });

  const requestService = jasmine.createSpyObj('requestService', {
    removeByHrefSubstring: {},
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [MyDSpaceBulkActionComponent],
      providers: [
        { provide: SelectableListService, useValue: selectableListService },
        { provide: RequestService, useValue: requestService },
        { provide: PoolTaskDataService, useValue: poolTaskService },
        { provide: ClaimedTaskDataService, useValue: claimedTaskService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: new SearchServiceStub('searchLink') },
        {
          provide: NgbModal, useValue: {
            /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
            open: () => {}
          }
        },
        { provide: UntypedFormBuilder, useValue: new UntypedFormBuilder() },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDSpaceBulkActionComponent);
    comp = fixture.componentInstance;
    comp.processing$.next(false);
    selectableListService.getSelectableList.and.returnValue(of({ selection: []}));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('all button should be disabled by default', () => {
    const disabledButtons = fixture.debugElement.queryAll(By.css('button[data-test-disabled="true"]'));
    expect(disabledButtons.length).toBe(4);
  });

  it('claim button should be enabled', () => {
    const mockAction = testAction;
    mockAction._embedded.indexableObject.type = 'claimaction';
    selectableListService.getSelectableList.and.returnValue(of({ selection: [mockAction]}));
    comp.claimEnabled$ = of(true);
    fixture.detectChanges();

    const disabledButtons = fixture.debugElement.queryAll(By.css('button[data-test-disabled="true"]'));
    const claimButton = fixture.debugElement.query(By.css('.btn.btn-info'));
    expect(disabledButtons.length).toBe(3);
    expect(claimButton.nativeElement.disabled).toBeFalsy();
  });

  it('claimed task buttons should be enabled', () => {
    const mockAction = testAction;
    mockAction._embedded.indexableObject.type = 'claimedtask';
    selectableListService.getSelectableList.and.returnValue(of({ selection: [mockAction]}));
    comp.claimedTaskActionsEnabled$ = of(true);
    fixture.detectChanges();

    const disabledButtons = fixture.debugElement.queryAll(By.css('button[data-test-disabled="true"]'));
    const approveButton = fixture.debugElement.query(By.css('.btn.btn-success'));
    const rejectButton = fixture.debugElement.query(By.css('.btn.btn-danger'));
    const returnToPoolButton = fixture.debugElement.query(By.css('.btn.btn-secondary'));
    expect(disabledButtons.length).toBe(1);
    expect(approveButton.nativeElement.disabled).toBeFalsy();
    expect(rejectButton.nativeElement.disabled).toBeFalsy();
    expect(returnToPoolButton.nativeElement.disabled).toBeFalsy();
  });

  it('All buttons should be enabled', () => {
    const mockAction = testAction;
    const mockAction2 = testAction;
    mockAction._embedded.indexableObject.type = 'claimaction';
    mockAction2._embedded.indexableObject.type = 'claimedtask';
    selectableListService.getSelectableList.and.returnValue(of({ selection: [mockAction, mockAction2]}));
    comp.claimEnabled$ = of(true);
    comp.claimedTaskActionsEnabled$ = of(true);
    fixture.detectChanges();

    const disabledButtons = fixture.debugElement.queryAll(By.css('button[data-test-disabled="true"]'));
    expect(disabledButtons.length).toBe(0);
  });

});
