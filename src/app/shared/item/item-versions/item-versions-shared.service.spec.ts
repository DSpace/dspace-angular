import { TestBed } from '@angular/core/testing';

import { ItemVersionsSharedService } from './item-versions-shared.service';
import { ActivatedRoute } from '@angular/router';
import { VersionDataService } from '../../../core/data/version-data.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';

describe('ItemVersionsSharedService', () => {
  let service: ItemVersionsSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: {} },
        { provide: VersionDataService, useValue: {} },
        { provide: VersionHistoryDataService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: WorkspaceitemDataService, useValue: {} },
        { provide: WorkflowItemDataService, useValue: {} },
      ],
    });
    service = TestBed.inject(ItemVersionsSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
