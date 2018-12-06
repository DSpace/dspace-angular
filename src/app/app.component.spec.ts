import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Store, StoreModule } from '@ngrx/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { AppComponent } from './app.component';
import { AuthService } from './core/auth/auth.service';
import { MetadataService } from './core/metadata/metadata.service';
import { HostWindowResizeAction } from './shared/host-window.actions';
import { HostWindowState } from './shared/host-window.reducer';
import { AngularticsMock } from './shared/mocks/mock-angulartics.service';
import { AuthServiceMock } from './shared/mocks/mock-auth.service';
import { MockMetadataService } from './shared/mocks/mock-metadata-service';
import { MockTranslateLoader } from './shared/mocks/mock-translate-loader';
import { NativeWindowRef, NativeWindowService } from './shared/services/window.service';
import { ENV_CONFIG, GLOBAL_CONFIG } from '../config';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let de: DebugElement;
let el: HTMLElement;

describe('App component', () => {

  // async beforeEach
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        CommonModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader
          }
        }),
      ],
      declarations: [AppComponent], // declare the test component
      providers: [
        { provide: GLOBAL_CONFIG, useValue: ENV_CONFIG },
        { provide: NativeWindowService, useValue: new NativeWindowRef() },
        { provide: MetadataService, useValue: new MockMetadataService() },
        { provide: Angulartics2GoogleAnalytics, useValue: new AngularticsMock() },
        { provide: AuthService, useValue: new AuthServiceMock() },
        { provide: Router, useValue: {} },
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);

    comp = fixture.componentInstance; // component test instance

    // query for the <div class='outer-wrapper'> by CSS element selector
    de = fixture.debugElement.query(By.css('div.outer-wrapper'));
    el = de.nativeElement;
  });

  it('should create component', inject([AppComponent], (app: AppComponent) => {
    // Perform test using fixture and service
    expect(app).toBeTruthy();
  }));

  describe('when the window is resized', () => {
    let width: number;
    let height: number;
    let store: Store<HostWindowState>;

    beforeEach(() => {
      store = fixture.debugElement.injector.get(Store) as Store<HostWindowState>;
      spyOn(store, 'dispatch');

      window.dispatchEvent(new Event('resize'));
      width = window.innerWidth;
      height = window.innerHeight;
    });

    it('should dispatch a HostWindowResizeAction with the width and height of the window as its payload', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new HostWindowResizeAction(width, height));
    });

  });
});
