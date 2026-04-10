import {
  ChangeDetectionStrategy,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ClaimedTask } from '@dspace/core/tasks/models/claimed-task-object.model';
import { ProcessTaskResponse } from '@dspace/core/tasks/models/process-task-response';
import { PoolTaskDataService } from '@dspace/core/tasks/pool-task-data.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { getMockRequestService } from '@dspace/core/testing/request.service.mock';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { getMockSearchService } from '@dspace/core/testing/search-service.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { SearchService } from '../../../search/search.service';
import { ClaimedTaskActionsReturnToPoolComponent } from './claimed-task-actions-return-to-pool.component';

let component: ClaimedTaskActionsReturnToPoolComponent;
let fixture: ComponentFixture<ClaimedTaskActionsReturnToPoolComponent>;

const searchService = getMockSearchService();

const requestService = getMockRequestService();

let mockPoolTaskDataService: PoolTaskDataService;

describe('ClaimedTaskActionsReturnToPoolComponent', () => {
  const object = Object.assign(new ClaimedTask(), { id: 'claimed-task-1' });
  const claimedTaskService = jasmine.createSpyObj('claimedTaskService', {
    returnToPoolTask: of(new ProcessTaskResponse(true)),
  });

  beforeEach(waitForAsync(() => {
    mockPoolTaskDataService = new PoolTaskDataService(null, null, null, null);
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ClaimedTaskActionsReturnToPoolComponent,
      ],
      providers: [
        { provide: ClaimedTaskDataService, useValue: claimedTaskService },
        { provide: Injector, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: Router, useValue: new RouterStub() },
        { provide: SearchService, useValue: searchService },
        { provide: RequestService, useValue: requestService },
        { provide: PoolTaskDataService, useValue: mockPoolTaskDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedTaskActionsReturnToPoolComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ClaimedTaskActionsReturnToPoolComponent);
    component = fixture.componentInstance;
    component.object = object;
    spyOn(component, 'initReloadAnchor').and.returnValue(undefined);
    fixture.detectChanges();
  }));

  it('should display return to pool button', () => {
    const btn = fixture.debugElement.query(By.css('.btn-secondary'));

    expect(btn).not.toBeNull();
  });

  it('should display spin icon when return to pool action is pending', () => {
    component.processing$.next(true);
    fixture.detectChanges();

    const span = fixture.debugElement.query(By.css('.btn-secondary .fa-spin'));

    expect(span).not.toBeNull();
  });

  describe('actionExecution', () => {
    beforeEach(() => {
      component.actionExecution().subscribe();
      fixture.detectChanges();
    });

    it('should call claimedTaskService\'s returnToPoolTask', () => {
      expect(claimedTaskService.returnToPoolTask).toHaveBeenCalledWith(object.id);
    });

  });

  describe('reloadObjectExecution', () => {
    beforeEach(() => {
      spyOn(mockPoolTaskDataService, 'findByItem').and.returnValue(of(null));

      component.itemUuid = 'uuid';
      component.reloadObjectExecution().subscribe();
      fixture.detectChanges();
    });

    it('should call poolTaskDataService findItem with itemUuid', () => {
      expect(mockPoolTaskDataService.findByItem).toHaveBeenCalledWith('uuid');
    });
  });

});
