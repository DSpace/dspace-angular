import { Store } from '@ngrx/store';
import { async, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { TruncatableService } from './truncatable.service';
import { TruncatableCollapseAction, TruncatableExpandAction } from './truncatable.actions';
import { TruncatablesState } from './truncatable.reducer';

describe('TruncatableService', () => {
  const id1 = '123';
  const id2 = '456';
  let service: TruncatableService;
  const store: Store<TruncatablesState> = jasmine.createSpyObj('store', {
    /* tslint:disable:no-empty */
    dispatch: {},
    /* tslint:enable:no-empty */
    select: Observable.of(true)
  });
  beforeEach(async(() => {
    TestBed.configureTestingModule({

      providers: [
        {
          provide: Store, useValue: store
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = new TruncatableService(store);
  });

  describe('when the collapse method is triggered', () => {
    beforeEach(() => {
      service.collapse(id1);
    });

    it('TruncatableCollapseAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new TruncatableCollapseAction(id1));
    });

  });

  describe('when the expand method is triggered', () => {
    beforeEach(() => {
      service.expand(id2);
    });

    it('TruncatableExpandAction should be dispatched to the store', () => {
      expect(store.dispatch).toHaveBeenCalledWith(new TruncatableExpandAction(id2));
    });
  });

});
