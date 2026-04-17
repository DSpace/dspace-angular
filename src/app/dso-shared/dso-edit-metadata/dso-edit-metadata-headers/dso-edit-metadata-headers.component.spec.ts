import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { VarDirective } from '../../../shared/utils/var.directive';
import { DsoEditMetadataHeadersComponent } from './dso-edit-metadata-headers.component';

describe('DsoEditMetadataHeadersComponent', () => {
  let component: DsoEditMetadataHeadersComponent;
  let fixture: ComponentFixture<DsoEditMetadataHeadersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), DsoEditMetadataHeadersComponent, VarDirective],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoEditMetadataHeadersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display three headers', () => {
    expect(fixture.debugElement.queryAll(By.css('.ds-flex-cell')).length).toEqual(3);
  });
});
