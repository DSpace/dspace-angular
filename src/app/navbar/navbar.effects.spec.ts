import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import {
  cold,
  hot,
} from 'jasmine-marbles';
import { Observable } from 'rxjs';

import { HostWindowResizeAction } from '../shared/host-window.actions';
import { CollapseMenuAction } from '../shared/menu/menu.actions';
import { MenuService } from '../shared/menu/menu.service';
import { MenuID } from '../shared/menu/menu-id.model';
import { MenuServiceStub } from '../shared/testing/menu-service.stub';
import { NavbarEffects } from './navbar.effects';

describe('NavbarEffects', () => {
  let navbarEffects: NavbarEffects;
  let actions: Observable<any>;
  const menuService = new MenuServiceStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NavbarEffects,
        provideMockActions(() => actions),
        { provide: MenuService, useValue: menuService },
        // other providers
      ],
    });

    navbarEffects = TestBed.inject(NavbarEffects);
  });

  describe('resize$', () => {

    it('should return a COLLAPSE action in response to a RESIZE action', () => {
      actions = hot('--a-', { a: new HostWindowResizeAction(800, 600) });

      const expected = cold('--b-', { b: new CollapseMenuAction(MenuID.PUBLIC) });

      expect(navbarEffects.resize$).toBeObservable(expected);
    });

  });

  describe('routeChange$', () => {

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action', () => {
      actions = hot('--a-', { a: { type: ROUTER_NAVIGATION } });

      const expected = cold('--b-', { b: new CollapseMenuAction(MenuID.PUBLIC) });

      expect(navbarEffects.routeChange$).toBeObservable(expected);
    });

  });
});
