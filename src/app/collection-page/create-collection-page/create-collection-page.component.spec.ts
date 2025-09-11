import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthService,
  DSONameService,
  CollectionDataService,
  CommunityDataService,
  RequestService,
  NotificationsService,
  RouteService,
  AuthServiceMock,
  DSONameServiceMock,
  NotificationsServiceStub,
} from '@dspace/core'
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

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
          useValue: { findById: () => of({ payload: { name: 'test' } }) },
        },
        { provide: RouteService, useValue: { getQueryParameterValue: () => of('1234') } },
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
