import { TestBed, waitForAsync } from '@angular/core/testing';
import { MenuServiceStub } from '../testing/menu-service.stub';
import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminSidebarComponent } from '../../admin/admin-sidebar/admin-sidebar.component';
import { MenuService } from '../menu/menu.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MenuID, MenuItemType } from '../menu/initial-menus-state';
import { DSOEditMenuResolver } from './dso-edit-menu.resolver';
import { DsoVersioningModalService } from './dso-versioning-modal-service/dso-versioning-modal.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Item } from '../../core/shared/item.model';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

describe('DSOEditMenuResolver', () => {

  const MENU_STATE = {
    id: 'some menu'
  };

  let resolver: DSOEditMenuResolver;

  let dSpaceObjectDataService;
  let menuService;
  let authorizationService;
  let dsoVersioningModalService;

  const route = {
    data: {
      menu: {
        'statistics': [{
          id: 'statistics-dummy-1',
          active: false,
          visible: true,
          model: null
        }]
      }
    },
    params: {id: 'test-uuid'},
  };

  const state = {
    url: 'test-url'
  };

  const testObject = Object.assign(new Item(), {uuid: 'test-uuid', type: 'item', _links: {self: {href: 'self-link'}}});

  const dummySections1 = [{
    id: 'dummy-1',
    active: false,
    visible: true,
    model: null
  },
    {
      id: 'dummy-2',
      active: false,
      visible: true,
      model: null
    }];

  const dummySections2 = [{
    id: 'dummy-3',
    active: false,
    visible: true,
    model: null
  },
    {
      id: 'dummy-4',
      active: false,
      visible: true,
      model: null
    },
    {
      id: 'dummy-5',
      active: false,
      visible: true,
      model: null
    }];

  beforeEach(waitForAsync(() => {
    menuService = new MenuServiceStub();
    spyOn(menuService, 'getMenu').and.returnValue(observableOf(MENU_STATE));

    dSpaceObjectDataService = jasmine.createSpyObj('dSpaceObjectDataService', {
      findById: createSuccessfulRemoteDataObject$(testObject)
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    dsoVersioningModalService = jasmine.createSpyObj('dsoVersioningModalService', {
      isNewVersionButtonDisabled: observableOf(false),
      getVersioningTooltipMessage: observableOf('message'),
      openCreateVersionModal: {}
    });

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NoopAnimationsModule, RouterTestingModule],
      declarations: [AdminSidebarComponent],
      providers: [
        {provide: DSpaceObjectDataService, useValue: dSpaceObjectDataService},
        {provide: MenuService, useValue: menuService},
        {provide: AuthorizationDataService, useValue: authorizationService},
        {provide: DsoVersioningModalService, useValue: dsoVersioningModalService},
        {
          provide: NgbModal, useValue: {
            open: () => {/*comment*/
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    resolver = TestBed.inject(DSOEditMenuResolver);

    spyOn(menuService, 'addSection');
  }));

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  describe('resolve', () => {
    it('should create all menus when a dso is found', (done) => {
      spyOn(resolver, 'getDsoMenus').and.returnValue(
        [observableOf(dummySections1), observableOf(dummySections2)]
      );
      resolver.resolve(route as any, null).subscribe(resolved => {
        expect(resolved).toEqual(
          {
            ...route.data.menu,
            [MenuID.DSO_EDIT]: [
              ...dummySections1.map((menu) => Object.assign(menu, {id: menu.id + '-test-uuid'})),
              ...dummySections2.map((menu) => Object.assign(menu, {id: menu.id + '-test-uuid'}))
            ]
          }
        );
        expect(resolver.getDsoMenus).toHaveBeenCalled();
        done();
      });
    });
    it('should return the statistics menu when no dso is found', (done) => {
      (dSpaceObjectDataService.findById as jasmine.Spy).and.returnValue(createFailedRemoteDataObject$());

      resolver.resolve(route as any, null).subscribe(resolved => {
        expect(resolved).toEqual(
          {
            ...route.data.menu
          }
        );
        done();
      });
    });
  });
  describe('getDsoMenus', () => {
    it('should return as first part the item version list ', (done) => {
      const result = resolver.getDsoMenus(testObject, route, state);
      result[0].subscribe((menuList) => {
        expect(menuList.length).toEqual(1);
        expect(menuList[0].id).toEqual('version-dso');
        expect(menuList[0].active).toEqual(false);
        expect(menuList[0].visible).toEqual(true);
        expect(menuList[0].model.type).toEqual(MenuItemType.ONCLICK);
        expect(menuList[0].model.text).toEqual('message');
        expect(menuList[0].model.disabled).toEqual(false);
        expect(menuList[0].icon).toEqual('code-branch');
        done();
      });

    });
    it('should return as second part the common list ', (done) => {
      const result = resolver.getDsoMenus(testObject, route, state);
      result[1].subscribe((menuList) => {
        expect(menuList.length).toEqual(1);
        expect(menuList[0].id).toEqual('edit-dso');
        expect(menuList[0].active).toEqual(false);
        expect(menuList[0].visible).toEqual(true);
        expect(menuList[0].model.type).toEqual(MenuItemType.LINK);
        expect(menuList[0].model.text).toEqual('item.page.edit');
        expect(menuList[0].model.link).toEqual('test-url/edit/metadata');
        expect(menuList[0].icon).toEqual('pencil-alt');
        done();
      });

    });
  });
});
