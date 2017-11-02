import { UniversalEffects } from './universal.effects';
import { Observable } from 'rxjs/Observable';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { UniversalReplayAction, UniversalReplayCompleteAction } from './universal.actions';

describe('UniversalEffects', () => {
  let universalEffects: UniversalEffects;
  let effectAction: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UniversalEffects,
        provideMockActions(() => effectAction)
      ]
    });

    universalEffects = TestBed.get(UniversalEffects);
  });

  describe('replay$', () => {
    it('should return all actions in the payload in order, followed by a REPLAY_COMPLETE action', () => {
      const payloadActions = [
        { type: 'A'},
        { type: 'B'},
        { type: 'C'}
      ];
      effectAction = hot('--a-', { a: new UniversalReplayAction(payloadActions) });

      const expected = cold('--(bcde)-', {
        b: payloadActions[0],
        c: payloadActions[1],
        d: payloadActions[2],
        e: new UniversalReplayCompleteAction()
      });

      expect(universalEffects.replay$).toBeObservable(expected);
    });

    it('should just return a REPLAY_COMPLETE action, if there are no actions in the payload', () => {
      const payloadActions = [];
      effectAction = hot('--a-', { a: new UniversalReplayAction(payloadActions) });

      const expected = cold('--b-', {
        b: new UniversalReplayCompleteAction()
      });

      expect(universalEffects.replay$).toBeObservable(expected);
    });
  });
});
