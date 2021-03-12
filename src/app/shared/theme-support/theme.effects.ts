import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { map, withLatestFrom, expand, switchMap, toArray, startWith, filter } from 'rxjs/operators';
import { SetThemeAction } from './theme.actions';
import { environment } from '../../../environments/environment';
import { ThemeConfig, themeFactory, Theme, } from '../../../config/theme.model';
import { hasValue, isNotEmpty, hasNoValue } from '../empty.util';
import { NoOpAction } from '../ngrx/no-op.action';
import { Store, select } from '@ngrx/store';
import { ThemeState } from './theme.reducer';
import { currentThemeSelector } from './theme.service';
import { of as observableOf, EMPTY, Observable } from 'rxjs';
import { ResolverActionTypes, ResolvedAction } from '../../core/resolving/resolver.actions';
import { followLink } from '../utils/follow-link-config.model';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { LinkService } from '../../core/cache/builders/link.service';
import { BASE_THEME_NAME } from './theme.constants';

export const DEFAULT_THEME_CONFIG = environment.themes.find((themeConfig: any) =>
  hasNoValue(themeConfig.regex) &&
  hasNoValue(themeConfig.handle) &&
  hasNoValue(themeConfig.uuid)
);

@Injectable()
export class ThemeEffects {
  /**
   * The list of configured themes
   */
  themes: Theme[];

  /**
   * True if at least one theme depends on the route
   */
  hasDynamicTheme: boolean;

  /**
   * Initialize with a theme that doesn't depend on the route.
   */
  initTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        if (hasValue(DEFAULT_THEME_CONFIG)) {
          return new SetThemeAction(DEFAULT_THEME_CONFIG.name);
        } else {
          return new SetThemeAction(BASE_THEME_NAME);
        }
      })
    )
  );

  /**
   * An effect that fires when a route change completes,
   * and determines whether or not the theme should change
   */
  updateThemeOnRouteChange$ = createEffect(() => this.actions$.pipe(
      // Listen for when a route change ends
      ofType(ROUTER_NAVIGATED),
      withLatestFrom(
        // Pull in the latest resolved action, or undefined if none was dispatched yet
        this.actions$.pipe(ofType(ResolverActionTypes.RESOLVED), startWith(undefined)),
        // and the current theme from the store
        this.store.pipe(select(currentThemeSelector))
      ),
      switchMap(([navigatedAction, resolvedAction, currentTheme]: [RouterNavigatedAction, ResolvedAction, string]) => {
        if (this.hasDynamicTheme === true && isNotEmpty(this.themes)) {
          const currentRouteUrl = navigatedAction.payload.routerState.url;
          // If resolvedAction exists, and deals with the current url
          if (hasValue(resolvedAction) && resolvedAction.payload.url === currentRouteUrl) {
            // Start with the resolved dso and go recursively through its parents until you reach the top-level community
            return observableOf(resolvedAction.payload.dso).pipe(
              this.getAncestorDSOs(),
              map((dsos: DSpaceObject[]) => {
                const dsoMatch =  this.matchThemeToDSOs(dsos, currentRouteUrl);
                return this.getActionForMatch(dsoMatch, currentTheme);
              })
            );
          }

          // check whether the route itself matches
          const routeMatch = this.themes.find((theme: Theme) => theme.matches(currentRouteUrl, undefined));

          return [this.getActionForMatch(routeMatch, currentTheme)];
        }

        // If there are no themes configured, do nothing
        return [new NoOpAction()];
      })
    )
  );

  /**
   * return the action to dispatch based on the given matching theme
   *
   * @param newTheme The theme to create an action for
   * @param currentThemeName The name of the currently active theme
   * @private
   */
  private getActionForMatch(newTheme: Theme, currentThemeName: string): SetThemeAction | NoOpAction {
    if (hasValue(newTheme) && newTheme.config.name !== currentThemeName) {
      // If we have a match, and it isn't already the active theme, set it as the new theme
      return new SetThemeAction(newTheme.config.name);
    } else {
      // Otherwise, do nothing
      return new NoOpAction();
    }
  }

  /**
   * Check the given DSpaceObjects in order to see if they match the configured themes in order.
   * If a match is found, the matching theme is returned
   *
   * @param dsos The DSpaceObjects to check
   * @param currentRouteUrl The url for the current route
   * @private
   */
  private matchThemeToDSOs(dsos: DSpaceObject[], currentRouteUrl: string): Theme {
    // iterate over the themes in order, and return the first one that matches
    return this.themes.find((theme: Theme) => {
      // iterate over the dsos's in order (most specific one first, so Item, Collection,
      // Community), and return the first one that matches the current theme
      const match = dsos.find((dso: DSpaceObject) => theme.matches(currentRouteUrl, dso));
      return hasValue(match);
    });

  }

  /**
   * An rxjs operator that will return an array of all the ancestors of the DSpaceObject used as
   * input. The initial DSpaceObject will be the first element of the output array, followed by
   * its parent, its grandparent etc
   *
   * @private
   */
  private getAncestorDSOs() {
    return (source: Observable<DSpaceObject>): Observable<DSpaceObject[]> =>
      source.pipe(
        expand((dso: DSpaceObject) => {
          // Check if the dso exists and has a parent link
          if (hasValue(dso) && typeof (dso as any).getParentLinkKey === 'function') {
            const linkName = (dso as any).getParentLinkKey();
            // If it does, retrieve it.
            return this.linkService.resolveLinkWithoutAttaching<DSpaceObject, DSpaceObject>(dso, followLink(linkName)).pipe(
              getFirstCompletedRemoteData(),
              map((rd: RemoteData<DSpaceObject>) => {
                if (hasValue(rd.payload)) {
                  // If there's a parent, use it for the next iteration
                  return rd.payload;
                } else {
                  // If there's no parent, or an error, return null, which will stop recursion
                  // in the next iteration
                  return null;
                }
              }),
            );
          }

          // The current dso has no value, or no parent. Return EMPTY to stop recursion
          return EMPTY;
        }),
        // only allow through DSOs that have a value
        filter((dso: DSpaceObject) => hasValue(dso)),
        // Wait for recursion to complete, and emit all results at once, in an array
        toArray()
      );
  }

  constructor(
    private actions$: Actions,
    private store: Store<ThemeState>,
    private linkService: LinkService,
  ) {
    // Create objects from the theme configs in the environment file
    this.themes = environment.themes.map((themeConfig: ThemeConfig) => themeFactory(themeConfig));
    this.hasDynamicTheme = environment.themes.some((themeConfig: any) =>
      hasValue(themeConfig.regex) ||
      hasValue(themeConfig.handle) ||
      hasValue(themeConfig.uuid)
    );
  }
}
