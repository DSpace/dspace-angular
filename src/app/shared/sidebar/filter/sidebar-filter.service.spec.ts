import { TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import { sidebarFilterReducer } from './sidebar-filter.reducer';
import { SidebarFilterService } from './sidebar-filter.service';
import {
  FilterCollapseAction,
  FilterExpandAction,
  FilterInitializeAction,
  FilterToggleAction
} from './sidebar-filter.actions';
import { storeModuleConfig } from '../../../app.reducer';

describe('SidebarFilterService', () => {
  let service: SidebarFilterService;
  let store: any;
  let initialState;

  function init() {

    initialState = {
      sidebarFilter: {
        filter_1: {
          filterCollapsed: true
        },
        filter_2: {
          filterCollapsed: false
        },
        filter_3: {
          filterCollapsed: true
        }
      }
    };

  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ sidebarFilter: sidebarFilterReducer }, storeModuleConfig)
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: SidebarFilterService, useValue: service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(Store);
    service = new SidebarFilterService(store);
    spyOn(store, 'dispatch');
  });

  describe('initializeFilter', () => {
    it('should dispatch an FilterInitializeAction with the correct arguments', () => {
      service.initializeFilter('fakeFilter', true);
      expect(store.dispatch).toHaveBeenCalledWith(new FilterInitializeAction('fakeFilter', true));
    });
  });

  describe('collapse', () => {
    it('should dispatch an FilterInitializeAction with the correct arguments', () => {
      service.collapse('fakeFilter');
      expect(store.dispatch).toHaveBeenCalledWith(new FilterCollapseAction('fakeFilter'));
    });
  });

  describe('expand', () => {
    it('should dispatch an FilterInitializeAction with the correct arguments', () => {
      service.expand('fakeFilter');
      expect(store.dispatch).toHaveBeenCalledWith(new FilterExpandAction('fakeFilter'));
    });
  });

  describe('toggle', () => {
    it('should dispatch an FilterInitializeAction with the correct arguments', () => {
      service.toggle('fakeFilter');
      expect(store.dispatch).toHaveBeenCalledWith(new FilterToggleAction('fakeFilter'));
    });
  });

  describe('isCollapsed', () => {
    it('should return true', () => {

      const result = service.isCollapsed('filter_1');
      const expected = cold('b', {
        b: true
      });

      expect(result).toBeObservable(expected);
    });

    it('should return false', () => {

      const result = service.isCollapsed('filter_2');
      const expected = cold('b', {
        b: false
      });

      expect(result).toBeObservable(expected);
    });
  });
});
