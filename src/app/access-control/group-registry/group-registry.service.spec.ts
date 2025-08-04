import { TestBed } from '@angular/core/testing';
import { Group } from '@dspace/core/eperson/models/group.model';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';

import { AppState } from '../../app.reducer';
import {
  GroupRegistryCancelGroupAction,
  GroupRegistryEditGroupAction,
} from './group-registry.actions';
import {
  editGroupSelector,
  GroupRegistryService,
} from './group-registry.service';

describe('GroupRegistryService', () => {
  let service: GroupRegistryService;
  let store: MockStore<AppState>;
  const initialState = {
    groupRegistry: {
      editGroup: { id: 'test-id', name: 'Test Group' } as Group,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupRegistryService,
        provideMockStore({ initialState }),
      ],
    });

    service = TestBed.inject(GroupRegistryService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should select the active group from the store', (done) => {
    store.overrideSelector(editGroupSelector, initialState.groupRegistry.editGroup);

    service.getActiveGroup().subscribe(group => {
      expect(group).toEqual(initialState.groupRegistry.editGroup);
      done();
    });
  });

  it('should dispatch cancel edit group action', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    service.cancelEditGroup();
    expect(dispatchSpy).toHaveBeenCalledWith(new GroupRegistryCancelGroupAction());
  });

  it('should dispatch edit group action with group', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const group: Group = { id: '123', name: 'New Group' } as Group;
    service.editGroup(group);
    expect(dispatchSpy).toHaveBeenCalledWith(new GroupRegistryEditGroupAction(group));
  });
});
