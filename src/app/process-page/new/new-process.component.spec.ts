import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  createSuccessfulRemoteDataObject$,
  LinkService,
  NotificationsService,
  NotificationsServiceStub,
  ProcessDataService,
  ProcessParameter,
  RequestService,
  Script,
  ScriptDataService,
  ScriptParameter,
  TranslateLoaderMock,
} from '@dspace/core';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { HasValuePipe } from '../../shared/utils/has-value.pipe';
import { VarDirective } from '../../shared/utils/var.directive';
import { ProcessFormComponent } from '../form/process-form.component';
import { NewProcessComponent } from './new-process.component';

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
    scriptService = jasmine.createSpyObj(
      'scriptService',
      {
        invoke: observableOf({
          response:
          {
            isSuccessful: true,
          },
        }),
        findAll: createSuccessfulRemoteDataObject$(script),
      },
    );
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
        NewProcessComponent, VarDirective
        ,
        HasValuePipe,
      ],
      providers: [
        { provide: ScriptDataService, useValue: scriptService },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        { provide: RequestService, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
        { provide: LinkService, useValue: {} },
        { provide: ProcessDataService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(NewProcessComponent, {
        remove: {
          imports: [ProcessFormComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
