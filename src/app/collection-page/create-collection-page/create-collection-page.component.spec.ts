import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouteService } from '../../core/services/route.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RequestService } from '../../core/data/request.service';
import { RouteService } from '../../core/services/route.service';
import { DSONameServiceMock } from '../../shared/mocks/dso-name.service.mock';
import { AuthService } from '../../core/auth/auth.service';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SharedModule } from '../../shared/shared.module';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { CreateCollectionPageComponent } from './create-collection-page.component';

describe('CreateCollectionPageComponent', () => {
  let comp: CreateCollectionPageComponent;
  let fixture: ComponentFixture<CreateCollectionPageComponent>;

  beforeEach(waitForAsync(() => {
    return TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, CreateCollectionPageComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: CollectionDataService, useValue: {} },
        {
          provide: CommunityDataService,
          useValue: { findById: () => observableOf({ payload: { name: 'test' } }) },
        },
        { provide: RouteService, useValue: { getQueryParameterValue: () => observableOf('1234') } },
        { provide: Router, useValue: {} },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: RequestService, useValue: {} },
        { provide: AuthService, useValue: new AuthServiceMock() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CreateCollectionPageComponent, {
        remove: {
          imports: [CollectionFormComponent]
        }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    });
  });
});
