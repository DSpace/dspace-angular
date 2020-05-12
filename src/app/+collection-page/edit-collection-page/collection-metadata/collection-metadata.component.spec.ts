import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CollectionMetadataComponent } from './collection-metadata.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';

describe('CollectionMetadataComponent', () => {
  let comp: CollectionMetadataComponent;
  let fixture: ComponentFixture<CollectionMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CollectionMetadataComponent],
      providers: [
        { provide: CollectionDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { parent: { data: observableOf({ dso: { payload: {} } }) } } },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionMetadataComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    })
  });
});
