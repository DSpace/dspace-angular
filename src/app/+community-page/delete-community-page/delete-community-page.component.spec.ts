import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';
import { CommunityDataService } from '../../core/data/community-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { SharedModule } from '../../shared/shared.module';
import { DeleteCommunityPageComponent } from './delete-community-page.component';

describe('DeleteCommunityPageComponent', () => {
  let comp: DeleteCommunityPageComponent;
  let fixture: ComponentFixture<DeleteCommunityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [DeleteCommunityPageComponent],
      providers: [
        { provide: CommunityDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: observableOf({ dso: { payload: {} } }) } },
        { provide: NotificationsService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/communities/');
    })
  });
});
