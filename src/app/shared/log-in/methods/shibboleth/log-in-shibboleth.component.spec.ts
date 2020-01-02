import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

import { EPerson } from '../../../../core/eperson/models/eperson.model';
import { EPersonMock } from '../../../testing/eperson-mock';
import { authReducer } from '../../../../core/auth/auth.reducer';
import { AuthService } from '../../../../core/auth/auth.service';
import { AuthServiceStub } from '../../../testing/auth-service-stub';
import { AppState } from '../../../../app.reducer';
import { AuthMethod } from '../../../../core/auth/models/auth.method';
import { AuthMethodType } from '../../../../core/auth/models/auth.method-type';
import { LogInShibbolethComponent } from './log-in-shibboleth.component';

describe('LogInShibbolethComponent', () => {

  let component: LogInShibbolethComponent;
  let fixture: ComponentFixture<LogInShibbolethComponent>;
  let page: Page;
  let user: EPerson;

  const authState = {
    authenticated: false,
    loaded: false,
    loading: false,
  };

  beforeEach(() => {
    user = EPersonMock;
  });

  beforeEach(async(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(authReducer),
        TranslateModule.forRoot()
      ],
      declarations: [
        LogInShibbolethComponent
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: 'authMethodProvider',
          useValue: new AuthMethod(AuthMethodType.Shibboleth, 'dspace.test/shibboleth')
        }
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();

  }));

  beforeEach(inject([Store], (store: Store<AppState>) => {
    store
      .subscribe((state) => {
        (state as any).core = Object.create({});
        (state as any).core.auth = authState;
      });

    // create component and test fixture
    fixture = TestBed.createComponent(LogInShibbolethComponent);

    // get test component from the fixture
    component = fixture.componentInstance;

    // create page
    page = new Page(component, fixture);

  }));

  it('should display a link with properly href', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('a'));
    expect(link.nativeElement.getAttribute('href')).toBe('dspace.test/shibboleth');
  });

});

/**
 * I represent the DOM elements and attach spies.
 *
 * @class Page
 */
class Page {

  public emailInput: HTMLInputElement;
  public navigateSpy: jasmine.Spy;
  public passwordInput: HTMLInputElement;

  constructor(private component: LogInShibbolethComponent, private fixture: ComponentFixture<LogInShibbolethComponent>) {
    // use injector to get services
    const injector = fixture.debugElement.injector;
    const store = injector.get(Store);

    // add spies
    this.navigateSpy = spyOn(store, 'dispatch');
  }

}
