import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { ObjectUpdatesEffects } from './object-updates.effects';
import { RemoveObjectUpdatesAction } from './object-updates.actions';

fdescribe('ObjectUpdatesEffects', () => {
  let updatesEffects: ObjectUpdatesEffects;
  let actions: Observable<any>;
  const testURL = 'www.dspace.org/dspace7';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ObjectUpdatesEffects,
        provideMockActions(() => actions),
        {
          provide: NotificationsService, useClass: {
            remove: (notification) => { /* empty */
            }
          }
        },
        // other providers
      ],
    });

    updatesEffects = TestBed.get(ObjectUpdatesEffects);
  });

  describe('mapLastActions$', () => {
    describe('When any ObjectUpdatesAction is triggered', () => {
      const action = new RemoveObjectUpdatesAction(testURL);
      it('should emit the action from the actionMap\'s value which key matches the action\'s URL', () => {
        actions = hot('--a-', { a: action });

        const expected = cold('--b-', { b: action });

        expect((updatesEffects as any).actionMap[testURL]).toBeObservable(expected);
      });
    });
  });

  // describe('removeAfterDiscardOrReinstateOnUndo$', () => {
  //
  //   it('should return a COLLAPSE action in response to an UPDATE_LOCATION action', () => {
  //     actions = hot('--a-', { a: { type: fromRouter.ROUTER_NAVIGATION } });
  //
  //     const expected = cold('--b-', { b: new CollapseMenuAction(MenuID.PUBLIC) });
  //
  //     expect(updatesEffects.routeChange$).toBeObservable(expected);
  //   });
  //
  // });
});
