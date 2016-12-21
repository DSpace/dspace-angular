import {
  async,
  TestBed
} from '@angular/core/testing';
import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnDestroy,
  OnInit, HostListener
} from "@angular/core";
import { TranslateService } from "ng2-translate";
import { HostWindowState } from "../app/shared/host-window.reducer";
import { Store } from "@ngrx/store";
import { HostWindowActions } from "../app/shared/host-window.actions";

// Load the implementations that should be tested
import { AppComponent } from '../app/app.component';


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
      declarations: [
        AppComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
