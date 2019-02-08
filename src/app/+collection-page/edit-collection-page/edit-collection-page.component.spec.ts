import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EditCollectionPageComponent } from './edit-collection-page.component';
import { RouteService } from '../../shared/services/route.service';
import { SharedModule } from '../../shared/shared.module';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { of as observableOf } from 'rxjs';

describe('EditCollectionPageComponent', () => {
  let comp: EditCollectionPageComponent;
  let fixture: ComponentFixture<EditCollectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [EditCollectionPageComponent],
      providers: [
        { provide: CollectionDataService, useValue: {} },
        { provide: RouteService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { data: observableOf({dso: undefined}) } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCollectionPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('frontendURL', () => {
    it('should have the right frontendURL set', () => {
      expect((comp as any).frontendURL).toEqual('/collections/');
    })
  });
});
