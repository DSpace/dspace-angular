import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { CommunityDataService } from '../../../core/data/community-data.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { SharedModule } from '../../../shared/shared.module';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { CommunityMetadataComponent } from './community-metadata.component';

describe('CommunityMetadataComponent', () => {
  let comp: CommunityMetadataComponent;
  let fixture: ComponentFixture<CommunityMetadataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CommunityMetadataComponent],
      providers: [
        { provide: CommunityDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ dso: { payload: {} } }) } } },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
