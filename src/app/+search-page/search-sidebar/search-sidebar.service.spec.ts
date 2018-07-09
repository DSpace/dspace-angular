import { Store } from '@ngrx/store';
import { SearchSidebarService } from './search-sidebar.service';
import { AppState } from '../../app.reducer';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { SearchSidebarCollapseAction, SearchSidebarExpandAction } from './search-sidebar.actions';
import { HostWindowService } from '../../shared/host-window.service';

describe('SearchSidebarService', () => {
  let service: SearchSidebarService;
  const store: Store<AppState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });
  const windowService = jasmine.createSpyObj('hostWindowService',
    {
      isXs: Observable.of(true),
      isSm: Observable.of(false),
      isXsOrSm: Observable.of(true)
    });
  beforeEach(async(() => {
    TestBed.configureTestingModule({

      providers: [
        {
          provide: Store, useValue: store
        },
        {
          provide: HostWindowService, useValue: windowService
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = new SearchSidebarService(store, windowService);
  }) ;

  describe('when the collapse method is triggered', () => {
    beforeEach(() => {
      service.collapse();
    });

    it('SearchSidebarCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchSidebarCollapseAction());
    });

  });

  describe('when the expand method is triggered', () => {
    beforeEach(() => {
      service.expand();
    });

    it('SearchSidebarExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new SearchSidebarExpandAction());
    });
  });

});
