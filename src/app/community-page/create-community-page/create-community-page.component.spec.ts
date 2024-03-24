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

import { AuthService } from '../../core/auth/auth.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RequestService } from '../../core/data/request.service';
import { RouteService } from '../../core/services/route.service';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
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
