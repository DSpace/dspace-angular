// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DsDynamicListComponent } from './dynamic-list.component';
import { DynamicListCheckboxGroupModel } from './dynamic-list-checkbox-group.model';
import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { FormBuilderService } from '../../../form-builder.service';
import { DynamicFormControlLayout, DynamicFormsCoreModule, DynamicFormValidationService } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { FormBuilderServiceStub } from '../../../../../testing/form-builder-service-stub';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Dynamic List component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;

  // async beforeEach
  beforeEach(async(() => {
    const authorityServiceStub = new AuthorityServiceStub();
    const formBuilderServiceStub = new FormBuilderServiceStub();

    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
      ],
      declarations: [
        DsDynamicListComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        AuthorityService,
        ChangeDetectorRef,
        DsDynamicListComponent,
        DynamicFormValidationService,
        FormBuilderService,
        {provide: AuthorityService, useValue: authorityServiceStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-dynamic-list
        [bindId]="bindId"
        [group]="group"
        [model]="model"
        [showErrorMessages]="showErrorMessages"
        (blur)="onBlur($event)"
        (change)="onValueChange($event)"
        (focus)="onFocus($event)"></ds-dynamic-list>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create DsDynamicListComponent', inject([DsDynamicListComponent], (app: DsDynamicListComponent) => {

    expect(app).toBeDefined();
  }));

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  group: FormGroup = new FormGroup({
    list: new FormGroup({}),
  });

  inputListModelConfig = {
    authorityOptions: {
      closed: false,
      metadata: 'list',
      name: 'type_programme',
      scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
    } as AuthorityOptions,
    disabled: false,
    errorMessages: {required: 'You must enter at least the year.'},
    id: 'list',
    label: 'Programme',
    name: 'list',
    placeholder: 'Programme',
    readOnly: false,
    required: true,
    repeatable: true
  };

  layout: DynamicFormControlLayout = {
    element: {
      group: ''
    }
  };

  model = new DynamicListCheckboxGroupModel(this.inputListModelConfig, this.layout);

  showErrorMessages = false;

}
