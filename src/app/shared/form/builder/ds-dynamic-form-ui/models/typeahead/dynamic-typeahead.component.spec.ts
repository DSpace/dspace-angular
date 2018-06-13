// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';

import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DsDynamicTypeaheadComponent } from './dynamic-typeahead.component';
import { DynamicTypeaheadModel } from './dynamic-typeahead.model';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Dynamic Dynamic Typeahead component', () => {

  let testComp: TestComponent;
  let testFixture: ComponentFixture<TestComponent>;
  let html;

  // async beforeEach
  beforeEach(async(() => {
    const authorityServiceStub = new AuthorityServiceStub();

    TestBed.configureTestingModule({
      imports: [
        DynamicFormsCoreModule,
        DynamicFormsNGBootstrapUIModule,
        FormsModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      declarations: [
        DsDynamicTypeaheadComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicTypeaheadComponent,
        {provide: AuthorityService, useValue: authorityServiceStub},
        {provide: GLOBAL_CONFIG, useValue: {} as GlobalConfig},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-dynamic-typeahead [bindId]="bindId"
                            [group]="group"
                            [model]="model"
                            [showErrorMessages]="showErrorMessages"
                            (blur)="onBlur($event)"
                            (change)="onValueChange($event)"
                            (focus)="onFocus($event)"></ds-dynamic-typeahead>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create DsDynamicTypeaheadComponent', inject([DsDynamicTypeaheadComponent], (app: DsDynamicTypeaheadComponent) => {

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
    typeahead: new FormControl(),
  });

  inputTypeaheadModelConfig = {
    authorityOptions: {
      closed: false,
      metadata: 'typeahead',
      name: 'EVENTAuthority',
      scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
    } as AuthorityOptions,
    disabled: false,
    id: 'typeahead',
    label: 'Conference',
    minChars: 3,
    name: 'typeahead',
    placeholder: 'Conference',
    readOnly: false,
    required: false,
    repeatable: false,
    value: undefined
  }

  model = new DynamicTypeaheadModel(this.inputTypeaheadModelConfig);

  showErrorMessages = false;

}
