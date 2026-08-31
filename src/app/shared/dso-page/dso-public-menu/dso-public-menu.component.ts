/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { MenuComponent } from '../../menu/menu.component';
import { MenuService } from '../../menu/menu.service';
import { MenuComponentLoaderComponent } from '../../menu/menu-component-loader/menu-component-loader.component';
import { MenuID } from '../../menu/menu-id.model';
import { ThemeService } from '../../theme-support/theme.service';

/**
 * Component that renders the DSO public menu.
 * This menu holds item menu voices available to unauthenticated users.
 */
@Component({
  selector: 'ds-dso-public-menu',
  styleUrls: ['./dso-public-menu.component.scss'],
  templateUrl: './dso-public-menu.component.html',
  imports: [
    AsyncPipe,
    MenuComponentLoaderComponent,
  ],
})
export class DsoPublicMenuComponent extends MenuComponent {

  menuID = MenuID.DSO_PUBLIC;

  menuVisibleWithSections$: Observable<boolean>;

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    public authorizationService: AuthorizationDataService,
    public route: ActivatedRoute,
    protected themeService: ThemeService,
  ) {
    super(menuService, injector, authorizationService, route, themeService);
    this.menuVisibleWithSections$ = this.menuService.getMenuTopSections(MenuID.DSO_PUBLIC).pipe(
      switchMap((sections) => {
        if (sections.length === 0) {return of(false);}
        return combineLatest(
          sections.map((section) =>
            this.menuService.getSubSectionsByParentID(MenuID.DSO_PUBLIC, section.id).pipe(
              map((subSections) => subSections.length > 0),
            ),
          ),
        ).pipe(
          map((results) => results.some((hasVisible) => hasVisible)),
        );
      }),
    );
  }
}
