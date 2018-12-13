import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminSidebarComponent } from './admin-sidebar.component';
import { MenuService } from '../../shared/menu/menu.service';
import { MenuServiceStub } from '../../shared/testing/menu-service-stub';
import { CSSVariableService } from '../../shared/sass-helper/sass-helper.service';
import { CSSVariableServiceStub } from '../../shared/testing/css-variable-service-stub';
import { AuthServiceStub } from '../../shared/testing/auth-service-stub';
import { AuthService } from '../../core/auth/auth.service';
import { NgComponentOutlet } from '@angular/common';
import { MockDirective } from 'ng-mocks';

fdescribe('AdminSidebarComponent', () => {
  let comp: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;
  let menuService: AdminSidebarComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule],
      declarations: [AdminSidebarComponent, MockDirective(NgComponentOutlet)],
      providers: [
        { provide: Injector, useValue: {} },
        { provide: MenuService, useClass: MenuServiceStub },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: AuthService, useClass: AuthServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(AdminSidebarComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSidebarComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    menuService = (comp as any).menuService;
    // spyOn(comp as any, 'getSectionDataInjector').and.returnValue(new Map());
    // spyOn(comp as any, 'getSectionComponent').and.returnValue(observableOf(MenuSection));
    fixture.detectChanges();
  });

  describe('startSlide', () => {
    describe('when expanding', () => {
      beforeEach(() => {
        comp.sidebarClosed = true;
        comp.startSlide({ toState: 'expanded' } as any);
      });

      it('should set the sidebarClosed to false', () => {
        expect(comp.sidebarClosed).toBeFalsy();
      })
    });

    describe('when collapsing', () => {
      beforeEach(() => {
        comp.sidebarClosed = false;
        comp.startSlide({ toState: 'collapsed' } as any);
      });

      it('should set the sidebarClosed to false', () => {
        expect(comp.sidebarClosed).toBeTruthy();
      })
    })
  });

  // describe('expand', () => {
  //   beforeEach(() => {
  //     spyOn(menuService, 'expandMenu');
  //     comp.expand(new Event('click'));
  //   });
  //   it('should trigger the expandMenu function on the menu service', () => {
  //     expect(menuService.expandMenu).toHaveBeenCalledWith(comp.menuID);
  //   })
  // });
});
