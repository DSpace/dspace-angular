import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessParametersComponent } from './process-parameters.component';
import { ProcessParameter } from '../../processes/process-parameter.model';
import { By } from '@angular/platform-browser';
import { ParameterSelectComponent } from './parameter-select/parameter-select.component';
import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Script } from '../../scripts/script.model';
import { ScriptParameter } from '../../scripts/script-parameter.model';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';

describe('ProcessParametersComponent', () => {
  let component: ProcessParametersComponent;
  let fixture: ComponentFixture<ProcessParametersComponent>;
  let mockParameterValues: ProcessParameter[];
  let mockScript: Script;

  function initParametersAndScriptMockValues() {
    const param1 = new ScriptParameter();
    const param2 = new ScriptParameter();
    mockScript = Object.assign(new Script(), { parameters: [param1, param2] });
    mockParameterValues = [
      Object.assign(new ProcessParameter(), { name: '-a', value: 'bla' }),
      Object.assign(new ProcessParameter(), { name: '-b', value: '123' }),
      Object.assign(new ProcessParameter(), { name: '-c', value: 'value' }),
    ];
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })],
      declarations: [ProcessParametersComponent, ParameterSelectComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessParametersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when parameter values and script are initialized', () => {

    beforeEach(() => {
      initParametersAndScriptMockValues();
      component.parameterValues = mockParameterValues;
      component.script = mockScript;

      fixture.detectChanges();
    });

    it(`should render a ${ParameterSelectComponent.name} for each parameter value`, () => {
      const selectComponents = fixture.debugElement.queryAll(By.directive(ParameterSelectComponent));
      expect(selectComponents.length).toBe(mockParameterValues.length);
    });

    it('should not render a selector box if the parameter array is empty',() => {
      fixture.componentInstance.script.parameters = [];

      fixture.detectChanges();

      const formGroupComponent = fixture.debugElement.query(By.css('[data-testID=parameters-select-container]'));
      expect(formGroupComponent).toBeFalsy();
    });
  });
});
