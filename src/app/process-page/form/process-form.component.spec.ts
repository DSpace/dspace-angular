import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { ScriptDataService } from '@dspace/core/data/processes/script-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { ProcessParameter } from '@dspace/core/processes/process-parameter.model';
import { Script } from '@dspace/core/shared/scripts/script.model';
import { ScriptParameter } from '@dspace/core/shared/scripts/script-parameter.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { NotificationsServiceStub } from '@dspace/core/testing/notifications-service.stub';
import { RouterMock } from '@dspace/core/testing/router.mock';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of } from 'rxjs';

import { ProcessFormComponent } from './process-form.component';
import { ScriptsSelectComponent } from './scripts-select/scripts-select.component';

describe('ProcessFormComponent', () => {
  let component: ProcessFormComponent;
  let fixture: ComponentFixture<ProcessFormComponent>;
  let scriptService;
  let router;
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
    scriptService = jasmine.createSpyObj(
      'scriptService',
      {
        invoke: of({
          response:
            {
              isSuccessful: true,
            },
        }),
      },
    );
    router = {
      navigateByUrl: () => undefined,
    };
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
        ProcessFormComponent,
      ],
      providers: [
        { provide: ScriptDataService, useValue: scriptService },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: RequestService, useValue: jasmine.createSpyObj('requestService', ['removeBySubstring', 'removeByHrefSubstring']) },
        { provide: Router, useValue: new RouterMock() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ProcessFormComponent, {
        remove: {
          imports: [
            ScriptsSelectComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFormComponent);
    component = fixture.componentInstance;
    component.parameters = parameterValues;
    component.selectedScript = script;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call invoke on the scriptService on submit', () => {
    component.submitForm({ controls: {} } as any);
    expect(scriptService.invoke).toHaveBeenCalled();
  });

  describe('when undefined parameters are provided', () => {
    beforeEach(() => {
      component.parameters = undefined;
    });

    it('should invoke the script with an empty array of parameters', () => {
      component.submitForm({ controls: {} } as any);
      expect(scriptService.invoke).toHaveBeenCalledWith(script.id, [], jasmine.anything());
    });
  });
});
