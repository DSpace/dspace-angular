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
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { buildPaginatedList } from '../../../core/data/paginated-list.model';
import { ScriptDataService } from '../../../core/data/processes/script-data.service';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../../shared/testing/active-router.stub';
import { RouterStub } from '../../../shared/testing/router.stub';
import { Script } from '../../scripts/script.model';
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

  it('should load more scripts when scrolled to the bottom', fakeAsync(() => {
    spyOn(component, 'loadScripts');
    const event = {
      target: {
        scrollTop: 100,
        clientHeight: 200,
        scrollHeight: 300,
      },
    };

    component.onScroll(event);
    tick();

    expect(component.loadScripts).toHaveBeenCalled();
  }));

  it('should load more scripts when scrolled almost to the bottom', fakeAsync(() => {
    spyOn(component, 'loadScripts');
    const event = {
      target: {
        scrollTop: 99,
        clientHeight: 200,
        scrollHeight: 300,
      },
    };

    component.onScroll(event);
    tick();

    expect(component.loadScripts).toHaveBeenCalled();
  }));

  it('should not load more scripts if already loading', fakeAsync(() => {
    spyOn(component, 'loadScripts');
    component.isLoading$.next(true);
    const event = {
      target: {
        scrollTop: 100,
        clientHeight: 200,
        scrollHeight: 300,
      },
    };

    component.onScroll(event);
    tick();

    expect(component.loadScripts).not.toHaveBeenCalled();
  }));

  it('should not load more scripts if it is the last page', fakeAsync(() => {
    spyOn(component, 'loadScripts');
    (component as any)._isLastPage = true;
    const event = {
      target: {
        scrollTop: 100,
        clientHeight: 200,
        scrollHeight: 300,
      },
    };

    component.onScroll(event);
    tick();

    expect(component.loadScripts).not.toHaveBeenCalled();
  }));

  it('should not load more scripts if not scrolled to the bottom', fakeAsync(() => {
    spyOn(component, 'loadScripts');
    const event = {
      target: {
        scrollTop: 50,
        clientHeight: 200,
        scrollHeight: 300,
      },
    };

    component.onScroll(event);
    tick();

    expect(component.loadScripts).not.toHaveBeenCalled();
  }));
});
