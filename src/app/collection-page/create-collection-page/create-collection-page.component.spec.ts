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

import { AuthService } from '@dspace/core';
import { DSONameService } from '@dspace/core';
import { CollectionDataService } from '@dspace/core';
import { CommunityDataService } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { RouteService } from '@dspace/core';
import { NotificationsServiceStub } from '@dspace/core';
import { AuthServiceMock } from '../../shared/mocks/auth.service.mock';
import { DSONameServiceMock } from '../../shared/mocks/dso-name.service.mock';
import { CollectionFormComponent } from '../collection-form/collection-form.component';
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
          imports: [CollectionFormComponent],
        },
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
