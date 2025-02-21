import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthService } from '../../../../modules/core/src/lib/core/auth/auth.service';
import { CommunityDataService } from '../../../../modules/core/src/lib/core/data/community-data.service';
import { RequestService } from '../../../../modules/core/src/lib/core/data/request.service';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import { RouteService } from '../../../../modules/core/src/lib/core/services/route.service';
import { NotificationsServiceStub } from '../../../../modules/core/src/lib/core/utilities/testing/notifications-service.stub';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { CommunityFormComponent } from '../community-form/community-form.component';
import { CreateCommunityPageComponent } from './create-community-page.component';

describe('CreateCommunityPageComponent', () => {
  let comp: CreateCommunityPageComponent;
  let fixture: ComponentFixture<CreateCommunityPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, CreateCommunityPageComponent],
      providers: [
        { provide: CommunityDataService, useValue: { findById: () => observableOf({}) } },
        { provide: RouteService, useValue: { getQueryParameterValue: () => observableOf('1234') } },
        { provide: Router, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: RequestService, useValue: {} },
        { provide: AuthService, useValue: new AuthServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CreateCommunityPageComponent, {
        remove: {
          imports: [CommunityFormComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/communities/');
    });
  });
});
