import { Injectable, Inject } from '@angular/core';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import { EMPTY, Observable, of as observableOf } from 'rxjs';
import { ThemeState } from './theme.reducer';
import { SetThemeAction, ThemeActionTypes } from './theme.actions';
import { expand, filter, map, switchMap, take, toArray } from 'rxjs/operators';
import { hasValue, isNotEmpty } from '../empty.util';
import { RemoteData } from '../../core/data/remote-data';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { Theme, ThemeConfig, themeFactory } from '../../../config/theme.model';
import { NO_OP_ACTION_TYPE, NoOpAction } from '../ngrx/no-op.action';
import { followLink } from '../utils/follow-link-config.model';
import { LinkService } from '../../core/cache/builders/link.service';
import { environment } from '../../../environments/environment';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { ActivatedRouteSnapshot } from '@angular/router';
import { GET_THEME_CONFIG_FOR_FACTORY } from '../object-collection/shared/listable-object/listable-object.decorator';

export const themeStateSelector = createFeatureSelector<ThemeState>('theme');

export const currentThemeSelector = createSelector(
  themeStateSelector,
  (state: ThemeState): string => hasValue(state) ? state.currentTheme : undefined
);

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  /**
   * The list of configured themes
   */
  themes: Theme[];

  /**
   * True if at least one theme depends on the route
   */
  hasDynamicTheme: boolean;

  constructor(
    private store: Store<ThemeState>,
    private linkService: LinkService,
    private dSpaceObjectDataService: DSpaceObjectDataService,
    @Inject(GET_THEME_CONFIG_FOR_FACTORY) private gtcf: (str) => ThemeConfig
  ) {
    // Create objects from the theme configs in the environment file
    this.themes = environment.themes.map((themeConfig: ThemeConfig) => themeFactory(themeConfig));
    this.hasDynamicTheme = environment.themes.some((themeConfig: any) =>
      hasValue(themeConfig.regex) ||
      hasValue(themeConfig.handle) ||
      hasValue(themeConfig.uuid)
    );
  }

  setTheme(newName: string) {
    this.store.dispatch(new SetThemeAction(newName));
  }

  getThemeName(): string {
    let currentTheme: string;
    this.store.pipe(
      select(currentThemeSelector),
      take(1)
    ).subscribe((name: string) =>
      currentTheme = name
    );
    return currentTheme;
  }

  getThemeName$(): Observable<string> {
    return this.store.pipe(
      select(currentThemeSelector)
    );
  }

  /**
   * Determine whether or not the theme needs to change depending on the current route's URL and snapshot data
   * If the snapshot contains a dso, this will be used to match a theme
   * If the snapshot contains a scope parameters, this will be used to match a theme
   * Otherwise the URL is matched against
   * If none of the above find a match, the theme doesn't change
   * @param currentRouteUrl
   * @param activatedRouteSnapshot
   * @return Observable boolean emitting whether or not the theme has been changed
   */
  updateThemeOnRouteChange$(currentRouteUrl: string, activatedRouteSnapshot: ActivatedRouteSnapshot): Observable<boolean> {
    // and the current theme from the store
    const currentTheme$: Observable<string> = this.store.pipe(select(currentThemeSelector));

    const action$ = currentTheme$.pipe(
      switchMap((currentTheme: string) => {
        const snapshotWithData = this.findRouteData(activatedRouteSnapshot);
        if (this.hasDynamicTheme === true && isNotEmpty(this.themes)) {
          if (hasValue(snapshotWithData) && hasValue(snapshotWithData.data) && hasValue(snapshotWithData.data.dso)) {
            const dsoRD: RemoteData<DSpaceObject> = snapshotWithData.data.dso;
            if (dsoRD.hasSucceeded) {
              // Start with the resolved dso and go recursively through its parents until you reach the top-level community
              return observableOf(dsoRD.payload).pipe(
                this.getAncestorDSOs(),
                map((dsos: DSpaceObject[]) => {
                  const dsoMatch = this.matchThemeToDSOs(dsos, currentRouteUrl);
                  return this.getActionForMatch(dsoMatch, currentTheme);
                })
              );
            }
          }
          if (hasValue(activatedRouteSnapshot.queryParams) && hasValue(activatedRouteSnapshot.queryParams.scope)) {
            const dsoFromScope$: Observable<RemoteData<DSpaceObject>> = this.dSpaceObjectDataService.findById(activatedRouteSnapshot.queryParams.scope);
            // Start with the resolved dso and go recursively through its parents until you reach the top-level community
            return dsoFromScope$.pipe(
              getFirstSucceededRemoteData(),
              getRemoteDataPayload(),
              this.getAncestorDSOs(),
              map((dsos: DSpaceObject[]) => {
                const dsoMatch = this.matchThemeToDSOs(dsos, currentRouteUrl);
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
      }),
      take(1),
    );

    action$.pipe(
      filter((action) => action.type !== NO_OP_ACTION_TYPE),
    ).subscribe((action) => {
      this.store.dispatch(action);
    });

    return action$.pipe(
      map((action) => action.type === ThemeActionTypes.SET),
    );
  }

  /**
   * Find a DSpaceObject in one of the provided route snapshots their data
   * Recursively looks for the dso in the routes their child routes until it reaches a dead end or finds one
   * @param routes
   */
  findRouteData(...routes: ActivatedRouteSnapshot[]) {
    const result = routes.find((route) => hasValue(route.data) && hasValue(route.data.dso));
    if (hasValue(result)) {
      return result;
    } else {
      const nextLevelRoutes = routes
        .map((route: ActivatedRouteSnapshot) => route.children)
        .reduce((combined: ActivatedRouteSnapshot[], current: ActivatedRouteSnapshot[]) => [...combined, ...current]);
      if (isNotEmpty(nextLevelRoutes)) {
        return this.findRouteData(...nextLevelRoutes);
      } else {
        return undefined;
      }
    }
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
   * Searches for a ThemeConfig by its name;
   */
  getThemeConfigFor(themeName: string): ThemeConfig {
    return this.gtcf(themeName);
  }
}
