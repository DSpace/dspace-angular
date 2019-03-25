import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ThemeService } from './theme.service';
import { SetThemeAction } from './theme.actions';
import * as ngrx from '@ngrx/store';
import { Theme } from '../../../config/theme.inferface';
import { of as observableOf } from 'rxjs';
import { first } from 'rxjs/operators';

describe('ThemeService', () => {
  let service: ThemeService;
  let store: Store<CoreState>;
  const initialTheme: Theme = {
    name: 'test theme',
    cssClass: 'test-class'
  };
  const config = {
    themes: [initialTheme]
  } as any;
  beforeEach(() => {
    store = new Store<CoreState>(undefined, undefined, undefined);
    spyOn(store, 'dispatch');
    service = new ThemeService(store, config);
  });

  describe('when the service is created', () => {
    beforeEach(() => {
      spyOn(ThemeService.prototype, 'setCurrentTheme');
      service = new ThemeService(store, config);
    });

    it('should call setCurrentTheme action on itself with the theme from the configuration', () => {
      expect(service.setCurrentTheme).toHaveBeenCalledWith(initialTheme);
    });
  });

  describe('when setCurrentTheme op the service is called', () => {
    it('should dispatch a SET action on the store', () => {
      service.setCurrentTheme(initialTheme);
      expect(store.dispatch).toHaveBeenCalledWith(new SetThemeAction(initialTheme));
    });
  });

  describe('when getCurrentTheme op the service is called', () => {
    beforeEach(() => {
      spyOnProperty(ngrx, 'select').and.callFake(() => {
        return () => {
          return () => observableOf({ theme: initialTheme });
        };
      });
    });

    it('should select the current theme from the store', () => {
      const theme = service.getCurrentTheme();
      theme.pipe(first()).subscribe((newTheme) => {
        expect(newTheme).toEqual(initialTheme);
      });
    });
  });
});
