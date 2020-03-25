import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NewProcessComponent } from './new-process.component';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { MockTranslateLoader } from '../../shared/testing/mock-translate-loader';
import { ScriptParameter } from '../scripts/script-parameter.model';
import { Script } from '../scripts/script.model';
import { ProcessParameter } from '../processes/process-parameter.model';

describe('NewProcessComponent', () => {
  let component: NewProcessComponent;
  let fixture: ComponentFixture<NewProcessComponent>;
  let scriptService;
  let parameterValues;
  let script;

  function init() {
    const param1 = new ScriptParameter();
    const param2 = new ScriptParameter();
    script = Object.assign(new Script(), { parameters: [param1, param2] });
    parameterValues = [
      Object.assign(new ProcessParameter(), { name: '-a', value: 'bla' }),
      Object.assign(new ProcessParameter(), { name: '-b', value: '123' }),
      Object.assign(new ProcessParameter(), { name: '-c', value: 'value' }),
    ];
    scriptService = jasmine.createSpyObj('scriptService', ['invoke'])
  }

  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        })],
      declarations: [NewProcessComponent],
      providers: [
        { provide: ScriptDataService, useValue: scriptService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProcessComponent);
    component = fixture.componentInstance;
    component.parameters = parameterValues;
    component.selectedScript = script;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call invoke on the scriptService on submit', () => {
    component.submitForm({ invalid: false });
    expect(scriptService.invoke).toHaveBeenCalled();
  });
});
