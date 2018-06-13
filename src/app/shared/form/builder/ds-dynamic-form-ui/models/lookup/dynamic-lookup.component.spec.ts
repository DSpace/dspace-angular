// Load the implementations that should be tested
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, inject, TestBed, } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthorityOptions } from '../../../../../../core/integration/models/authority-options.model';
import { DynamicFormsCoreModule } from '@ng-dynamic-forms/core';
import { DynamicFormsNGBootstrapUIModule } from '@ng-dynamic-forms/ui-ng-bootstrap';
import { AuthorityService } from '../../../../../../core/integration/authority.service';
import { AuthorityServiceStub } from '../../../../../testing/authority-service-stub';
import { DsDynamicLookupComponent } from './dynamic-lookup.component';
import { DynamicLookupModel } from './dynamic-lookup.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TranslateModule } from '@ngx-translate/core';

function createTestComponent<T>(html: string, type: { new(...args: any[]): T }): ComponentFixture<T> {
  TestBed.overrideComponent(type, {
    set: {template: html}
  });
  const fixture = TestBed.createComponent(type);

  fixture.detectChanges();
  return fixture as ComponentFixture<T>;
}

describe('Dynamic Lookup component', () => {

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
        InfiniteScrollModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        DsDynamicLookupComponent,
        TestComponent,
      ], // declare the test component
      providers: [
        ChangeDetectorRef,
        DsDynamicLookupComponent,
        {provide: AuthorityService, useValue: authorityServiceStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

  }));

  // synchronous beforeEach
  beforeEach(() => {
    html = `
      <ds-dynamic-lookup
        [bindId]="bindId"
        [group]="group"
        [model]="model"
        [showErrorMessages]="showErrorMessages"
        (blur)="onBlur($event)"
        (change)="onValueChange($event)"
        (focus)="onFocus($event)"></ds-dynamic-lookup>`;

    testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
    testComp = testFixture.componentInstance;
  });

  it('should create DsDynamicLookupComponent', inject([DsDynamicLookupComponent], (app: DsDynamicLookupComponent) => {

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

  inputLookupModelConfig = {
    authorityOptions: {
      closed: false,
      metadata: 'lookup',
      name: 'RPAuthority',
      scope: 'c1c16450-d56f-41bc-bb81-27f1d1eb5c23'
    } as AuthorityOptions,
    disabled: false,
    errorMessages: {required: 'Required field.'},
    id: 'lookup',
    label: 'Author',
    maxOptions: 10,
    name: 'lookup',
    placeholder: 'Author',
    readOnly: false,
    required: true,
    repeatable: true,
    separator: ',',
    validators: {required: null},
    value: undefined
  };

  model = new DynamicLookupModel(this.inputLookupModelConfig);

  showErrorMessages = false;

}
