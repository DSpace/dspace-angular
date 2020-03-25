import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MockTranslateLoader } from '../../../../../shared/mocks/mock-translate-loader';
import { By } from '@angular/platform-browser';
import { FileValueInputComponent } from './file-value-input.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FileValueAccessorDirective } from '../../../../../shared/utils/file-value-accessor.directive';
import { FileValidator } from '../../../../../shared/utils/require-file.validator';

describe('FileValueInputComponent', () => {
  let component: FileValueInputComponent;
  let fixture: ComponentFixture<FileValueInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })],
      declarations: [FileValueInputComponent, FileValueAccessorDirective, FileValidator],
      schemas: [NO_ERRORS_SCHEMA]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileValueInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show a validation error if the input field was left untouched but left empty', () => {
    const validationError = fixture.debugElement.query(By.css('.validation-error'));
    expect(validationError).toBeFalsy();
  });

  it('should show a validation error if the input field was touched but left empty',  () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('blur', null);

    fixture.detectChanges();

    const validationError = fixture.debugElement.query(By.css('.validation-error'));
    expect(validationError).toBeTruthy();
  });
});
