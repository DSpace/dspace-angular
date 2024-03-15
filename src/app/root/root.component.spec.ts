import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RootComponent } from './root.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RouterMock } from '../shared/mocks/router.mock';
import { MenuService } from '../shared/menu/menu.service';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { CSSVariableServiceStub } from '../shared/testing/css-variable-service.stub';
import { HostWindowService } from '../shared/host-window.service';
import { HostWindowServiceStub } from '../shared/testing/host-window-service.stub';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuServiceStub } from '../shared/testing/menu-service.stub';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      declarations: [RootComponent], // declare the test component
      providers: [
        { provide: Router, useValue: new RouterMock() },
        { provide: MenuService, useValue: new MenuServiceStub() },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(800) },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
