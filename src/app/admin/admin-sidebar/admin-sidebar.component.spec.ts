import {
  ChangeDetectionStrategy,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { ScriptDataService } from '../../core/data/processes/script-data.service';
import { Item } from '../../core/shared/item.model';
import { MenuService } from '../../shared/menu/menu.service';
import { getMockThemeService } from '../../shared/mocks/theme-service.mock';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { CSSVariableService } from '../../shared/sass-helper/css-variable.service';
import { AuthServiceStub } from '../../shared/testing/auth-service.stub';
import { CSSVariableServiceStub } from '../../shared/testing/css-variable-service.stub';
import { MenuServiceStub } from '../../shared/testing/menu-service.stub';
import { ThemeService } from '../../shared/theme-support/theme.service';
import { AdminSidebarComponent } from './admin-sidebar.component';

describe('AdminSidebarComponent', () => {
  let comp: AdminSidebarComponent;
  let fixture: ComponentFixture<AdminSidebarComponent>;
  const menuService = new MenuServiceStub();
  let authorizationService: AuthorizationDataService;
  let scriptService;


  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    _links: {
      self: {
        href: 'https://localhost:8000/items/fake-id',
      },
    },
  });


  const routeStub = {
    data: of({
      dso: createSuccessfulRemoteDataObject(mockItem),
    }),
    children: [],
  };

  const mockNgbModal = {
    open: jasmine.createSpy('open').and.returnValue(
      { componentInstance: {}, closed: of({}) } as NgbModalRef,
    ),
  };


  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });
    scriptService = jasmine.createSpyObj('scriptService', { scriptWithNameExistsAndCanExecute: of(true) });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, RouterTestingModule, AdminSidebarComponent],
      providers: [
        Injector,
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: MenuService, useValue: menuService },
        { provide: CSSVariableService, useClass: CSSVariableServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ActivatedRoute, useValue: {} },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ScriptDataService, useValue: scriptService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: NgbModal, useValue: mockNgbModal },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(AdminSidebarComponent, {
      set: {
        changeDetection: ChangeDetectionStrategy.Default,
      },
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOn(menuService, 'getMenuTopSections').and.returnValue(of([]));
    fixture = TestBed.createComponent(AdminSidebarComponent);
    comp = fixture.componentInstance; // SearchPageComponent test instance
    comp.sections = of([]);
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
      });
    });

    describe('when collapsing', () => {
      beforeEach(() => {
        comp.sidebarClosed = false;
        comp.startSlide({ toState: 'collapsed' } as any);
      });

      it('should set the sidebarOpen to false', () => {
        expect(comp.sidebarOpen).toBeFalsy();
      });
    });
  });

  describe('finishSlide', () => {
    describe('when expanding', () => {
      beforeEach(() => {
        comp.sidebarClosed = true;
        comp.startSlide({ fromState: 'expanded' } as any);
      });

      it('should set the sidebarClosed to true', () => {
        expect(comp.sidebarClosed).toBeTruthy();
      });
    });

    describe('when collapsing', () => {
      beforeEach(() => {
        comp.sidebarClosed = false;
        comp.startSlide({ fromState: 'collapsed' } as any);
      });

      it('should set the sidebarOpen to true', () => {
        expect(comp.sidebarOpen).toBeTruthy();
      });
    });
  });

  describe('when the collapse link is clicked', () => {
    beforeEach(() => {
      spyOn(menuService, 'toggleMenu');
      const sidebarToggler = fixture.debugElement.query(By.css('#sidebar-collapse-toggle-container > a'));
      sidebarToggler.triggerEventHandler('click', {
        preventDefault: () => {/**/
        },
      });
    });

    it('should call toggleMenu on the menuService', () => {
      expect(menuService.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when the the mouse enters the nav tag', () => {
    it('should call expandPreview on the menuService after 100ms', fakeAsync(() => {
      spyOn(menuService, 'expandMenuPreview');
      const sidebarToggler = fixture.debugElement.query(By.css('nav.navbar'));
      sidebarToggler.triggerEventHandler('mouseenter', {
        preventDefault: () => {/**/
        },
      });
      tick(99);
      expect(menuService.expandMenuPreview).not.toHaveBeenCalled();
      tick(1);
      expect(menuService.expandMenuPreview).toHaveBeenCalled();
    }));
  });

  describe('when the the mouse leaves the nav tag', () => {
    it('should call collapseMenuPreview on the menuService after 400ms', fakeAsync(() => {
      spyOn(menuService, 'collapseMenuPreview');
      const sidebarToggler = fixture.debugElement.query(By.css('nav.navbar'));
      sidebarToggler.triggerEventHandler('mouseleave', {
        preventDefault: () => {/**/
        },
      });
      tick(399);
      expect(menuService.collapseMenuPreview).not.toHaveBeenCalled();
      tick(1);
      expect(menuService.collapseMenuPreview).toHaveBeenCalled();
    }));
  });
});
