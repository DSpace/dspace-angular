import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  AuthService,
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
  NotificationsService,
  Version,
  VersionDataService,
  VersionHistoryDataService,
  WorkflowItemDataService,
  WorkspaceitemDataService,
} from '@dspace/core';
import { TranslateService } from '@ngx-translate/core';

import { ItemVersionsSharedService } from './item-versions-shared.service';

describe('ItemVersionsSharedService', () => {
  let service: ItemVersionsSharedService;
  let notificationService: NotificationsService;

  const successfulVersionRD = createSuccessfulRemoteDataObject<Version>(new Version());
  const failedVersionRD = createFailedRemoteDataObject<Version>();

  const notificationsServiceSpy = jasmine.createSpyObj('notificationsServiceSpy', ['success', 'error']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: VersionDataService, useValue: {} },
        { provide: VersionHistoryDataService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: NotificationsService, useValue: notificationsServiceSpy },
        { provide: TranslateService, useValue: { get: () => undefined } },
        { provide: WorkspaceitemDataService, useValue: {} },
        { provide: WorkflowItemDataService, useValue: {} },
      ],
    });
    service = TestBed.inject(ItemVersionsSharedService);
    notificationService = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when notifyCreateNewVersion is called', () => {
    it('should notify when successful', () => {
      service.notifyCreateNewVersion(successfulVersionRD);
      expect(notificationService.success).toHaveBeenCalled();
    });
    it('should notify when not successful', () => {
      service.notifyCreateNewVersion(failedVersionRD);
      expect(notificationService.error).toHaveBeenCalled();
    });
  });

});
