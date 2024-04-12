import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import {
  cold,
  hot,
} from 'jasmine-marbles';
import {
  Observable,
  Subject,
} from 'rxjs';
import { take } from 'rxjs/operators';

import { NoOpAction } from '../../../shared/ngrx/no-op.action';
import {
  INotification,
  Notification,
} from '../../../shared/notifications/models/notification.model';
import { NotificationType } from '../../../shared/notifications/models/notification-type';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import {
  DiscardObjectUpdatesAction,
  ObjectUpdatesAction,
  ReinstateObjectUpdatesAction,
  RemoveFieldUpdateAction,
  RemoveObjectUpdatesAction,
} from './object-updates.actions';
import { ObjectUpdatesEffects } from './object-updates.effects';

describe('ObjectUpdatesEffects', () => {
  let updatesEffects: ObjectUpdatesEffects;
  let actions: Observable<any>;
  let testURL = 'www.dspace.org/dspace7';
  let testUUID = '20e24c2f-a00a-467c-bdee-c929e79bf08d';
  const fakeID = 'id';
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        ObjectUpdatesEffects,
        provideMockActions(() => actions),
        { provide: NotificationsService, useClass: NotificationsServiceStub },
      ],
    });
  }));

  beforeEach(() => {
    testURL = 'www.dspace.org/dspace7';
    testUUID = '20e24c2f-a00a-467c-bdee-c929e79bf08d';
    updatesEffects = TestBed.inject(ObjectUpdatesEffects);
    (updatesEffects as any).actionMap$[testURL] = new Subject<ObjectUpdatesAction>();
    (updatesEffects as any).notificationActionMap$[fakeID] = new Subject<ObjectUpdatesAction>();
    (updatesEffects as any).notificationActionMap$[(updatesEffects as any).allIdentifier] = new Subject<ObjectUpdatesAction>();
  });

  describe('mapLastActions$', () => {
    describe('When any ObjectUpdatesAction is triggered', () => {
      let action;
      let emittedAction;
      beforeEach(() => {
        action = new RemoveObjectUpdatesAction(testURL);
      });
      it('should emit the action from the actionMap\'s value which key matches the action\'s URL', () => {
        actions = hot('--a-', { a: action });
        (updatesEffects as any).actionMap$[testURL].subscribe((act) => emittedAction = act);
        const expected = cold('--b-', { b: undefined });

        expect(updatesEffects.mapLastActions$).toBeObservable(expected);
        expect(emittedAction).toBe(action);
      });
    });
  });

  describe('removeAfterDiscardOrReinstateOnUndo$', () => {
    describe('When an ObjectUpdatesActionTypes.DISCARD action is triggered', () => {
      let infoNotification: INotification;
      let removeAction;
      describe('When there is no user interactions before the timeout is finished', () => {
        beforeEach(() => {
          infoNotification = new Notification('id', NotificationType.Info, 'info');
          infoNotification.options.timeOut = 0;
          removeAction = new RemoveObjectUpdatesAction(testURL);
        });
        it('should return a RemoveObjectUpdatesAction', () => {
          actions = hot('a', { a: new DiscardObjectUpdatesAction(testURL, infoNotification) });

          // Because we use Subject and not BehaviourSubject we need to subscribe to it beforehand because it does not
          // keep track of the current state
          let emittedAction: Action | undefined;
          updatesEffects.removeAfterDiscardOrReinstateOnUndo$.subscribe((action: Action | NoOpAction) => {
            emittedAction = action;
          });

          // This expect ensures that the mapLastActions$ was processed
          expect(updatesEffects.mapLastActions$).toBeObservable(cold('a', { a: undefined }));

          expect(emittedAction).toEqual(removeAction);
        });
      });

      describe('When there a REINSTATE action is fired before the timeout is finished', () => {
        beforeEach(() => {
          infoNotification = new Notification('id', NotificationType.Info, 'info');
          infoNotification.options.timeOut = 10;
        });
        it('should return an action with type NO_ACTION', () => {
          actions = hot('--(ab)', {
            a: new DiscardObjectUpdatesAction(testURL, infoNotification),
            b: new ReinstateObjectUpdatesAction(testURL),
          });

          // Because we use Subject and not BehaviourSubject we need to subscribe to it beforehand because it does not
          // keep track of the current state
          let emittedAction: Action | undefined;
          updatesEffects.removeAfterDiscardOrReinstateOnUndo$.pipe(
            take(2),
          ).subscribe((action: Action | NoOpAction) => {
            emittedAction = action;
          });

          // This expect ensures that the mapLastActions$ was processed
          expect(updatesEffects.mapLastActions$).toBeObservable(cold('--(ab)', { a: undefined, b: undefined }));

          expect(emittedAction).toEqual(new RemoveObjectUpdatesAction(testURL));
        });
      });

      describe('When there any ObjectUpdates action - other than REINSTATE - is fired before the timeout is finished', () => {
        beforeEach(() => {
          infoNotification = new Notification('id', NotificationType.Info, 'info');
          infoNotification.options.timeOut = 10;
        });
        it('should return a RemoveObjectUpdatesAction', () => {
          actions = hot('--(ab)', {
            a: new DiscardObjectUpdatesAction(testURL, infoNotification),
            b: new RemoveFieldUpdateAction(testURL, testUUID),
          });

          // Because we use Subject and not BehaviourSubject we need to subscribe to it beforehand because it does not
          // keep track of the current state
          let emittedAction: Action | undefined;
          updatesEffects.removeAfterDiscardOrReinstateOnUndo$.subscribe((action: Action | NoOpAction) => {
            emittedAction = action;
          });

          // This expect ensures that the mapLastActions$ was processed
          expect(updatesEffects.mapLastActions$).toBeObservable(cold('--(ab)', { a: undefined, b: undefined }));

          expect(emittedAction).toEqual(new RemoveObjectUpdatesAction(testURL));
        });
      });
    });
  });
});
