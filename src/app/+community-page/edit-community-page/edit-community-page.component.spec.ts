import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { of as observableOf } from 'rxjs';
import { EditCommunityPageComponent } from './edit-community-page.component';
import { CommunityDataService } from '../../core/data/community-data.service';

describe('EditCommunityPageComponent', () => {
  let comp: EditCommunityPageComponent;
  let fixture: ComponentFixture<EditCommunityPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [EditCommunityPageComponent],
      providers: [
        { provide: CommunityDataService, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: observableOf({ dso: { payload: {} } }) } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCommunityPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/communities/');
    })
  });
});
