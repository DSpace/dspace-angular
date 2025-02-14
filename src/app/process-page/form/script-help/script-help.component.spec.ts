import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { Script } from '../../scripts/script.model';
import { ScriptParameter } from '../../scripts/script-parameter.model';
import { ScriptParameterType } from '../../scripts/script-parameter-type.model';
import { ScriptHelpComponent } from './script-help.component';

describe('ScriptHelpComponent', () => {
  let component: ScriptHelpComponent;
  let fixture: ComponentFixture<ScriptHelpComponent>;
  let script;

  function init() {
    const param1 = Object.assign(
      new ScriptParameter(),
      { name: '-d', description: 'Lorem ipsum dolor sit amet,', type: ScriptParameterType.DATE },
    );
    const param2 = Object.assign(
      new ScriptParameter(),
      { name: '-f', description: 'consetetur sadipscing elitr', type: ScriptParameterType.BOOLEAN },
    );
    script = Object.assign(new Script(), { parameters: [param1, param2] });
  }
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        ScriptHelpComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptHelpComponent);
    component = fixture.componentInstance;
    component.script = script;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the name and description for each parameter of the script', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr'));
    expect(rows.length).toBe(script.parameters.length);
    script.parameters.forEach((parameter, index) => {
      expect(rows[index].queryAll(By.css('td'))[0].nativeElement.textContent).toContain(parameter.name);
      expect(rows[index].queryAll(By.css('td'))[1].nativeElement.textContent.trim()).toEqual(parameter.description);
    });
  });
});
