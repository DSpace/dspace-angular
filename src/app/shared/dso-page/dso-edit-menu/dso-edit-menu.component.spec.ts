import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { of as observableOf } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { DsoEditMenuComponent } from './dso-edit-menu.component';
import { MenuServiceStub } from '../../testing/menu-service.stub';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthServiceStub } from '../../testing/auth-service.stub';
import { MenuService } from '../../menu/menu.service';
import { ThemeService } from '../../theme-support/theme.service';
import { getMockThemeService } from '../../mocks/theme-service.mock';


import { DsoPageModule } from '../dso-page.module';
import { TextMenuItemModel } from '../../menu/menu-item/models/text.model';

describe('DsoEditMenuComponent', () => {
  let comp: DsoEditMenuComponent;
  let fixture: ComponentFixture<DsoEditMenuComponent>;
  const menuService = new MenuServiceStub();
  let authorizationService: AuthorizationDataService;

  const routeStub = {
    children: []
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
    index: 1
  };


  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    spyOn(menuService, 'getMenuTopSections').and.returnValue(observableOf([section]));
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, DsoPageModule],
      declarations: [DsoEditMenuComponent],
      providers: [
        Injector,
        {provide: MenuService, useValue: menuService},
        {provide: AuthService, useClass: AuthServiceStub},
        {provide: ActivatedRoute, useValue: routeStub},
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: ThemeService, useValue: getMockThemeService()},
      ],
      schemas: [NO_ERRORS_SCHEMA]
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

