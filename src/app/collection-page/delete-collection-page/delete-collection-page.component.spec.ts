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

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { RequestService } from '../../core/data/request.service';
import { DSONameServiceMock } from '../../shared/mocks/dso-name.service.mock';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { DeleteCollectionPageComponent } from './delete-collection-page.component';

describe('DeleteCollectionPageComponent', () => {
  let comp: DeleteCollectionPageComponent;
  let fixture: ComponentFixture<DeleteCollectionPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), CommonModule, RouterTestingModule, DeleteCollectionPageComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: CollectionDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: observableOf({ dso: { payload: {} } }) } },
        { provide: NotificationsService, useValue: {} },
        { provide: RequestService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCollectionPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    });
  });
});
