import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthService,
  CommunityDataService,
  RequestService,
  NotificationsService,
  RouteService,
  AuthServiceMock,
  NotificationsServiceStub,
} from '@dspace/core'
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CommunityFormComponent } from '../community-form/community-form.component';
import { CreateCommunityPageComponent } from './create-community-page.component';

describe('CreateCommunityPageComponent', () => {
  let comp: CreateCommunityPageComponent;
  let fixture: ComponentFixture<CreateCommunityPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, CreateCommunityPageComponent],
      providers: [
        { provide: CommunityDataService, useValue: { findById: () => of({}) } },
        { provide: RouteService, useValue: { getQueryParameterValue: () => of('1234') } },
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
