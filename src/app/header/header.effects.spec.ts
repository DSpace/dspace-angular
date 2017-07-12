import { TestBed, inject } from "@angular/core/testing";
import { EffectsTestingModule, EffectsRunner } from '@ngrx/effects/testing';
import { HeaderEffects } from "./header.effects";
import { HeaderCollapseAction } from "./header.actions";
import { HostWindowResizeAction } from "../shared/host-window.actions";
import { routerActions } from "@ngrx/router-store";

describe('HeaderEffects', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      HeaderEffects
    ]
  }));

  let runner: EffectsRunner;
  let headerEffects: HeaderEffects;

  beforeEach(inject([
    EffectsRunner, HeaderEffects
  ],
    (_runner, _headerEffects) => {
      runner = _runner;
      headerEffects = _headerEffects;
    }
  ));

  describe('resize$', () => {

    it('should return a COLLAPSE action in response to a RESIZE action', () => {
      runner.queue(new HostWindowResizeAction(800, 600));

      headerEffects.resize$.subscribe(result => {
        expect(result).toEqual(new HeaderCollapseAction());
      });
    });

  });

  describe('routeChange$', () => {

    it('should return a COLLAPSE action in response to an UPDATE_LOCATION action', () => {
      runner.queue({ type: routerActions.UPDATE_LOCATION });

      headerEffects.resize$.subscribe(result => {
        expect(result).toEqual(new HeaderCollapseAction());
      });
    });

  });
});
