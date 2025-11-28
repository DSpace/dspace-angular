import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicListDirective } from '@ng-dynamic-forms/core/directive/dynamic-list.directive';
import { DynamicTemplateDirective } from '@ng-dynamic-forms/core/directive/dynamic-template.directive';
import { DynamicCheckboxGroupModel } from '@ng-dynamic-forms/core/model/checkbox/dynamic-checkbox-group.model';
import { DynamicFormService } from '@ng-dynamic-forms/core/service/dynamic-form.service';

import { DynamicNGBootstrapCheckboxGroupComponent } from './dynamic-ng-bootstrap-checkbox-group.component';

describe('DynamicNGBootstrapCheckboxGroupComponent test suite', () => {
  const testModel = new DynamicCheckboxGroupModel({ id: 'checkboxGroup', group: [] });
  const formModel = [testModel];

  let formGroup: UntypedFormGroup;
  let fixture: ComponentFixture<DynamicNGBootstrapCheckboxGroupComponent>;
  let component: DynamicNGBootstrapCheckboxGroupComponent;
  let debugElement: DebugElement;
  let testElement: DebugElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        DynamicTemplateDirective,
        DynamicListDirective,
        DynamicNGBootstrapCheckboxGroupComponent,
      ],
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DynamicNGBootstrapCheckboxGroupComponent);

      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
    });
  }));

  beforeEach(inject([DynamicFormService], (service: DynamicFormService) => {
    formGroup = service.createFormGroup(formModel);

    component.group = formGroup;
    component.model = testModel;

    fixture.detectChanges();

    testElement = debugElement.query(By.css(`div.btn-group`));
  }));

  it('should initialize correctly', () => {
    expect(component.control instanceof UntypedFormGroup).toBe(true);
    expect(component.group instanceof UntypedFormGroup).toBe(true);
    expect(component.model instanceof DynamicCheckboxGroupModel).toBe(true);

    expect(component.blur).toBeDefined();
    expect(component.change).toBeDefined();
    expect(component.focus).toBeDefined();

    expect(component.onBlur).toBeDefined();
    expect(component.onChange).toBeDefined();
    expect(component.onFocus).toBeDefined();

    expect(component.hasFocus).toBe(false);
    expect(component.isValid).toBe(true);
    expect(component.isInvalid).toBe(false);
    expect(component.showErrorMessages).toBe(false);
  });

  it('should have an div.btn-group element', () => {
    expect(testElement instanceof DebugElement).toBe(true);
  });

  it('should emit blur event', () => {
    spyOn(component.blur, 'emit');

    component.onBlur(null);

    expect(component.blur.emit).toHaveBeenCalled();
  });

  it('should emit change event', () => {
    spyOn(component.change, 'emit');

    component.onChange(null);

    expect(component.change.emit).toHaveBeenCalled();
  });

  it('should emit focus event', () => {
    spyOn(component.focus, 'emit');

    component.onFocus(null);

    expect(component.focus.emit).toHaveBeenCalled();
  });
});
