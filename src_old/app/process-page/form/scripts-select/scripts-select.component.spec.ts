import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { buildPaginatedList } from '@dspace/core/data/paginated-list.model';
import { ScriptDataService } from '@dspace/core/data/processes/script-data.service';
import { Script } from '@dspace/core/shared/scripts/script.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { RouterStub } from '@dspace/core/testing/router.stub';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { ScriptsSelectComponent } from './scripts-select.component';

describe('ScriptsSelectComponent', () => {
  let component: ScriptsSelectComponent;
  let fixture: ComponentFixture<ScriptsSelectComponent>;
  let scriptService;
  let script1;
  let script2;

  function init() {
    script1 = new Script();
    script2 = new Script();
    scriptService = jasmine.createSpyObj('scriptService',
      {
        findAll: createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, [script1, script2])),
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
        ScriptsSelectComponent,
      ],
      providers: [
        { provide: ScriptDataService, useValue: scriptService },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptsSelectComponent);
    component = fixture.componentInstance;
    (component as any)._selectedScript = new Script();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show a validation error if the input field was left untouched but left empty', () => {
    const validationError = fixture.debugElement.query(By.css('.validation-error'));
    expect(validationError).toBeFalsy();
  });

  it('should show a validation error if the input field was touched but left empty', fakeAsync(() => {
    (component as any)._selectedScript.id = '';
    fixture.detectChanges();
    tick();

    const select = fixture.debugElement.query(By.css('#process-script'));
    select.triggerEventHandler('blur', null);

    fixture.detectChanges();

    const validationError = fixture.debugElement.query(By.css('.validation-error'));
    expect(validationError).toBeTruthy();
  }));

  it('should not show a validation error if the input field was touched but not left empty', fakeAsync(() => {
    (component as any)._selectedScript.id = 'testValue';
    fixture.detectChanges();
    tick();

    const select = fixture.debugElement.query(By.css('#process-script'));
    select.triggerEventHandler('blur', null);

    fixture.detectChanges();

    const validationError = fixture.debugElement.query(By.css('.validation-error'));
    expect(validationError).toBeFalsy();
  }));
});
