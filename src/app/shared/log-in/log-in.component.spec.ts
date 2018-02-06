/* tslint:disable:no-unused-variable */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "@angular/material";
import { By } from "@angular/platform-browser";
import { Store, StoreModule } from "@ngrx/store";
import { go } from "@ngrx/router-store";

// reducers
import { reducer } from "../../app.reducers";

// models
import { User } from "../../core/models/user";

// services
import { MOCK_USER } from "../../core/services/user.service";

// this component to test
import { LogInComponent } from "./log-in.component";

describe("LogInComponent", () => {

  let component: LogInComponent;
  let fixture: ComponentFixture<LogInComponent>;
  let page: Page;
  let user: User = new User();

  beforeEach(() => {
    user = MOCK_USER;
  });

  beforeEach(async(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        LogInComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();

    // create component and test fixture
    fixture = TestBed.createComponent(LogInComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    // create page
    page = new Page(component, fixture);

    // verify the fixture is stable (no pending tasks)
    fixture.whenStable().then(() => {
      page.addPageElements();
    });
  });

  it("should create a FormGroup comprised of FormControls", () => {
    fixture.detectChanges();
    expect(component.form instanceof FormGroup).toBe(true);
  });

  it("should authenticate", () => {
    fixture.detectChanges();

    // set FormControl values
    component.form.controls["email"].setValue(user.email);
    component.form.controls["password"].setValue(user.password);

    // submit form
    component.submit();

    // verify Store.dispatch() is invoked
    expect(page.navigateSpy.calls.any()).toBe(true, "Store.dispatch not invoked");
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

  constructor(private component: LogInComponent, private fixture: ComponentFixture<LogInComponent>) {
    // use injector to get services
    const injector = fixture.debugElement.injector;
    const store = injector.get(Store);

    // add spies
    this.navigateSpy  = spyOn(store, "dispatch");
  }

  public addPageElements() {
    const emailInputSelector = "input[formcontrolname=\"email\"]";
    // console.log(this.fixture.debugElement.query(By.css(emailInputSelector)));
    this.emailInput = this.fixture.debugElement.query(By.css(emailInputSelector)).nativeElement;

    const passwordInputSelector = "input[formcontrolname=\"password\"]";
    this.passwordInput = this.fixture.debugElement.query(By.css(passwordInputSelector)).nativeElement;
  }
}
