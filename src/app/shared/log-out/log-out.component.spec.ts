/* tslint:disable:no-unused-variable */
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Router } from "@angular/router";

// import ngrx
import { Store, StoreModule } from "@ngrx/store";

// reducers
import { reducer } from "../../app.reducers";

// test this component
import { SignOutComponent } from "./log-out.component";

describe("Component: Signout", () => {
  let component: SignOutComponent;
  let fixture: ComponentFixture<SignOutComponent>;

  beforeEach(async(() => {
    // refine the test module by declaring the test component
    TestBed.configureTestingModule({
      imports: [
        StoreModule.provideStore(reducer)
      ],
      declarations: [
        SignOutComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();

    // create component and test fixture
    fixture = TestBed.createComponent(SignOutComponent);

    // get test component from the fixture
    component = fixture.componentInstance;
  }));

  it("should create an instance", () => {
   expect(component).toBeTruthy();
  });
});
