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

describe('ClarinNavbarTopComponent', () => {
  let component: ClarinNavbarTopComponent;
  let fixture: ComponentFixture<ClarinNavbarTopComponent>;

  let authService: AuthService;
  authService = jasmine.createSpyObj('authService', {
    isAuthenticated: of(true),
    getAuthenticatedUserFromStore: createSuccessfulRemoteDataObject$(EPersonMock)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, NgbModule, FormsModule, ReactiveFormsModule, BrowserModule,
        TranslateModule.forRoot(),
      ],
      declarations: [ClarinNavbarTopComponent],
      providers: [
        { provide: AuthService, useValue: authService }
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
