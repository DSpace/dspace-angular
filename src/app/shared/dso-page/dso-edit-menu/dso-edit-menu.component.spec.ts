import {
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  AuthorizationDataService,
  AuthService,
  AuthServiceStub,
  MenuItemModel,
  MenuServiceStub,
} from '@dspace/core';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { MenuService } from '../../menu/menu.service';
import { getMockThemeService } from '../../mocks/theme-service.mock';
import { ThemeService } from '../../theme-support/theme.service';
import { DsoEditMenuComponent } from './dso-edit-menu.component';

describe('DsoEditMenuComponent', () => {
  let comp: DsoEditMenuComponent;
  let fixture: ComponentFixture<DsoEditMenuComponent>;
  const menuService = new MenuServiceStub();
  let authorizationService: AuthorizationDataService;

  const routeStub = {
    children: [],
  };

  const section = {
    id: 'edit-dso',
    active: false,
    visible: true,
    model: {
      type: null,
      disabled: false,
    } as MenuItemModel,
    icon: 'pencil-alt',
    index: 1,
  };


  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true),
    });
    spyOn(menuService, 'getMenuTopSections').and.returnValue(observableOf([section]));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, DsoEditMenuComponent],
      providers: [
        Injector,
        { provide: MenuService, useValue: menuService },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoEditMenuComponent);
    comp = fixture.componentInstance;
    comp.sections = observableOf([]);
    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('should create', () => {
      expect(comp).toBeTruthy();
    });
  });
});

