import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { DSONameServiceMock } from '@dspace/core/testing/dso-name.service.mock';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { DeleteCommunityPageComponent } from './delete-community-page.component';

describe('DeleteCommunityPageComponent', () => {
  let comp: DeleteCommunityPageComponent;
  let fixture: ComponentFixture<DeleteCommunityPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, DeleteCommunityPageComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: CommunityDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: of({ dso: { payload: {} } }) } },
        { provide: NotificationsService, useValue: {} },
        { provide: RequestService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/communities/');
    });
  });
});
