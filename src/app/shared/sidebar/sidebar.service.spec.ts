import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { AppState } from '../../app.reducer';
import { HostWindowService } from '../host-window.service';
import {
  SidebarCollapseAction,
  SidebarExpandAction,
} from './sidebar.actions';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let service: SidebarService;
  const store: Store<AppState> = jasmine.createSpyObj('store', {
    /* eslint-disable no-empty,@typescript-eslint/no-empty-function */
    dispatch: {},
    /* eslint-enable no-empty, @typescript-eslint/no-empty-function */
    pipe: of(true),
  });
  const windowService = jasmine.createSpyObj('hostWindowService',
    {
      isXs: of(true),
      isSm: of(false),
      isXsOrSm: of(true),
    });
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({

      providers: [
        {
          provide: Store, useValue: store,
        },
        {
          provide: HostWindowService, useValue: windowService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = new SidebarService(store, windowService);
  });

  describe('when the collapse method is triggered', () => {
    beforeEach(() => {
      service.collapse();
    });

    it('SidebarCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SidebarCollapseAction());
    });

  });

  describe('when the expand method is triggered', () => {
    beforeEach(() => {
      service.expand();
    });

    it('SidebarExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SidebarExpandAction());
    });
  });

});
