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
import { ProcessDetailFieldComponent } from './process-detail-field.component';

describe('ProcessDetailFieldComponent', () => {
  let component: ProcessDetailFieldComponent;
  let fixture: ComponentFixture<ProcessDetailFieldComponent>;

  let title;

  beforeEach(waitForAsync(() => {
    title = 'fake.title.message';

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), ProcessDetailFieldComponent, VarDirective],
      providers: [],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessDetailFieldComponent);
    component = fixture.componentInstance;
    component.title = title;
    fixture.detectChanges();
  });

  it('should display the given title', () => {
    const header = fixture.debugElement.query(By.css('h2')).nativeElement;
    expect(header.textContent).toContain(title);
  });
});
