import { TestBed } from '@angular/core/testing';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import {
  MockStore,
  provideMockStore,
} from '@ngrx/store/testing';
import { cold } from 'jasmine-marbles';

import { AppState } from '../../app.reducer';
import {
  EPeopleRegistryCancelEPersonAction,
  EPeopleRegistryEditEPersonAction,
} from './epeople-registry.actions';
import {
  editEPersonSelector,
  EpeopleRegistryService,
} from './epeople-registry.service';

describe('EpeopleRegistryService', () => {
  let service: EpeopleRegistryService;
  let store: MockStore<AppState>;
  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EpeopleRegistryService,
        provideMockStore({ initialState }),
      ],
    });

    service = TestBed.inject(EpeopleRegistryService);
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getActiveEPerson', () => {
    it('should select the editEPersonSelector from the store', () => {
      const mockEPerson: EPerson = { id: '123', name: 'Test User' } as EPerson;
      store.overrideSelector(editEPersonSelector, mockEPerson);

      const expected = cold('a', { a: mockEPerson });
      expect(service.getActiveEPerson()).toBeObservable(expected);
    });
  });

  describe('#cancelEditEPerson', () => {
    it('should dispatch EPeopleRegistryCancelEPersonAction', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      service.cancelEditEPerson();
      expect(dispatchSpy).toHaveBeenCalledWith(new EPeopleRegistryCancelEPersonAction());
    });
  });

  describe('#editEPerson', () => {
    it('should dispatch EPeopleRegistryEditEPersonAction with the given EPerson', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const mockEPerson: EPerson = { id: '456', name: 'Another User' } as EPerson;
      service.editEPerson(mockEPerson);
      expect(dispatchSpy).toHaveBeenCalledWith(new EPeopleRegistryEditEPersonAction(mockEPerson));
    });
  });
});
