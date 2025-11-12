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
import { AuthService } from '@dspace/core/auth/auth.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { AuthServiceStub } from '@dspace/core/testing/auth-service.stub';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MenuService } from '../../menu/menu.service';
import { TextMenuItemModel } from '../../menu/menu-item/models/text.model';
import { MenuServiceStub } from '../../menu/menu-service.stub';
import { getMockThemeService } from '../../theme-support/test/theme-service.mock';
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
      text: 'section-text',
      type: null,
      disabled: false,
    } as TextMenuItemModel,
    icon: 'pencil-alt',
    index: 1,
  };


  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });
    spyOn(menuService, 'getMenuTopSections').and.returnValue(of([section]));
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
    comp.sections = of([]);
    fixture.detectChanges();
  });

  describe('onInit', () => {
    it('should create', () => {
      expect(comp).toBeTruthy();
    });
  });
});

