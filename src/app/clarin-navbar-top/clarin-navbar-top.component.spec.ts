import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClarinNavbarTopComponent } from './clarin-navbar-top.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../core/auth/auth.service';
import { of } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../shared/remote-data.utils';
import { EPersonMock } from '../shared/testing/eperson.mock';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { ScriptLoaderService } from './script-loader-service';

describe('ClarinNavbarTopComponent', () => {
  let component: ClarinNavbarTopComponent;
  let fixture: ComponentFixture<ClarinNavbarTopComponent>;

  let authService: AuthService;
  let scriptLoader: ScriptLoaderService;
  let halService: HALEndpointService;

  authService = jasmine.createSpyObj('authService', {
    isAuthenticated: of(true),
    getAuthenticatedUserFromStore: createSuccessfulRemoteDataObject$(EPersonMock)
  });
  scriptLoader = jasmine.createSpyObj('scriptLoaderService', {
    load: new Promise((res, rej) => {/****/}),
  });
  halService = jasmine.createSpyObj('authService', {
    getRootHref: 'root url',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ClarinNavbarTopComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: HALEndpointService, useValue: halService },
        { provide: ScriptLoaderService, useValue: scriptLoader }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClarinNavbarTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load authenticated user', () => {
    authService.getAuthenticatedUserFromStore()
      .subscribe(user => {
        expect(user).toEqual(component.authenticatedUser);
      });
  });
});
