import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DSPACE_OBJECT_DELETION_SCRIPT_NAME,
  ScriptDataService,
} from '../../core/data/processes/script-data.service';
import { Community } from '../../core/shared/community.model';
import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import { DeleteCommunityPageComponent } from './delete-community-page.component';

describe('DeleteCommunityPageComponent', () => {
  let comp: DeleteCommunityPageComponent;
  let fixture: ComponentFixture<DeleteCommunityPageComponent>;
  let scriptService;
  let notificationService: NotificationsServiceStub;
  let router;

  const mockCommunity: Community = Object.assign(new Community(), {
    uuid: 'test-uuid',
    id: 'test-uuid',
    name: 'Test Community',
    type: 'community',
  });

  beforeEach(waitForAsync(() => {
    notificationService = new NotificationsServiceStub();
    scriptService = jasmine.createSpyObj('scriptService', {
      invoke: createSuccessfulRemoteDataObject$({ processId: '123' }),
    });
    router = jasmine.createSpyObj('router', ['navigateByUrl', 'navigate']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, DeleteCommunityPageComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: CommunityDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: of({ dso: { payload: mockCommunity } }) } },
        { provide: NotificationsService, useValue: notificationService },
        { provide: ScriptDataService, useValue: scriptService },
        { provide: Router, useValue: router },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should have the right frontendURL set', () => {
    expect((comp as any).frontendURL).toEqual('/communities/');
  });

  describe('onConfirm', () => {
    it('should invoke the deletion script with correct params, show success notification and redirect on success', (done) => {
      const parameterValues: ProcessParameter[] = [
        Object.assign(new ProcessParameter(), { name: '-i', value: mockCommunity.uuid }),
      ];
      (scriptService.invoke as jasmine.Spy).and.returnValue(createSuccessfulRemoteDataObject$({ processId: '123' }));
      comp.onConfirm(mockCommunity);
      setTimeout(() => {
        expect(scriptService.invoke).toHaveBeenCalledWith(DSPACE_OBJECT_DELETION_SCRIPT_NAME, parameterValues, []);
        expect(notificationService.success).toHaveBeenCalledWith('community.delete.notification.success');
        expect(router.navigateByUrl).toHaveBeenCalledWith(getProcessDetailRoute('123'));
        done();
      }, 0);
    });

    it('error notification is shown', (done) => {
      (scriptService.invoke as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$('Error', 500));
      comp.onConfirm(mockCommunity);
      setTimeout(() => {
        expect(notificationService.error).toHaveBeenCalledWith('community.delete.notification.fail');
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        done();
      }, 0);
    });
  });

});
