import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CommunityFormComponent } from '../../community-form/community-form.component';
import { CommunityMetadataComponent } from './community-metadata.component';

describe('CommunityMetadataComponent', () => {
  let comp: CommunityMetadataComponent;
  let fixture: ComponentFixture<CommunityMetadataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, CommunityMetadataComponent],
      providers: [
        { provide: CommunityDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { parent: { data: of({ dso: { payload: {} } }) } } },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CommunityMetadataComponent, {
        remove: {
          imports: [CommunityFormComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityMetadataComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/communities/');
    });
  });
});
