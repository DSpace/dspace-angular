// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';

import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { FormBuilderServiceStub } from '../../../../../testing/form-builder-service-stub';
import { DsDynamicTagComponent } from './dynamic-tag.component';
import { DynamicTagModel } from './dynamic-tag.model';
import { GlobalConfig } from '../../../../../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../../../../../config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Dynamic Dynamic Tag component', () => {

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
        NgbModule.forRoot(),
        ReactiveFormsModule,
      ],
      declarations: [
        DsDynamicTagComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicTagComponent,
        {provide: AuthorityService, useValue: authorityServiceStub},
        {provide: GLOBAL_CONFIG, useValue: {} as GlobalConfig},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-dynamic-tag [bindId]="bindId"
                      [group]="group"
                      [model]="model"
                      [showErrorMessages]="showErrorMessages"
                      (blur)="onBlur($event)"
                      (change)="onValueChange($event)"
                      (focus)="onFocus($event)"></ds-dynamic-tag>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create DsDynamicTagComponent', inject([DsDynamicTagComponent], (app: DsDynamicTagComponent) => {

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
    lookup: new FormControl(),
  });

  inputTagModelConfig = {
    authorityOptions: {
      closed: false,
      metadata: 'tag',
      name: 'common_iso_languages',
      scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
    } as AuthorityOptions,
    disabled: false,
    id: 'tag',
    label: 'Keywords',
    minChars: 3,
    name: 'tag',
    placeholder: 'Keywords',
    readOnly: false,
    required: false,
    repeatable: false
  };

  model = new DynamicTagModel(this.inputTagModelConfig);

  showErrorMessages = false;

}
