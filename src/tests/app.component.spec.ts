import {
  async,
  ComponentFixture,
  inject,
  TestBed
} from '@angular/core/testing';
import {
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { TranslateModule } from "ng2-translate";
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from "@ngrx/store";


// Load the implementations that should be tested
import { AppComponent } from '../app/app.component';
import { HeaderComponent } from '../app/header/header.component';


describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  /*beforeEach(() => TestBed.configureTestingModule({
    providers: [
      AppComponent,
      {
        provide: TranslateService,
        useClass: class { dispatch = jasmine.createSpy('dispatch') }
      },
      {
        provide: Store,
        useClass: class { dispatch = jasmine.createSpy('dispatch') }
      }
    ]}));*/

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppComponent,
        {
          provide: Store,
          useClass: class { dispatch = jasmine.createSpy('dispatch') }
        }
      ],
      declarations: [
        HeaderComponent
      ],
      imports: [TranslateModule.forRoot(), NgbCollapseModule.forRoot()],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });
    TestBed.compileComponents();
  });

  /*it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));*/

  it('should create the app', inject([ AppComponent ], (app: AppComponent) => {
    expect(app).toBeTruthy();
  }));

 /* beforeEach(() => {
    return TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        {
          provide: TranslateService,
          useClass: class { dispatch = jasmine.createSpy('dispatch') }
        },
        {
          provide: Store,
          useClass: class { dispatch = jasmine.createSpy('dispatch') }
        }
      ]
    });
  });*/

  /*it('should create component', async(() => {
    TestBed.compileComponents().then(() => {
      const fixture = TestBed.createComponent(AppComponent);

      // Access the dependency injected component instance
      const app = fixture.componentInstance;

      // Perform test using fixture and service
      expect(true).toBe(true);
    });
  }));*/

  it('true is true', () => expect(true).toBe(true));

});

