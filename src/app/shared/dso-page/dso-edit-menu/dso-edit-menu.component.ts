import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
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
import { MenuID } from '../../menu/menu-id.model';
import { ThemeService } from '../../theme-support/theme.service';

@Component({
  selector: 'ds-dso-edit-menu',
  styleUrls: ['./dso-edit-menu.component.scss'],
  templateUrl: './dso-edit-menu.component.html',
  imports: [
    AsyncPipe,
    NgComponentOutlet,
  ],
})
export class DsoEditMenuComponent extends MenuComponent {

  menuID = MenuID.DSO_EDIT;

  menuVisibleWithSections$: Observable<boolean>;

  constructor(
    protected menuService: MenuService,
    protected injector: Injector,
    public authorizationService: AuthorizationDataService,
    public route: ActivatedRoute,
    protected themeService: ThemeService,
  ) {
    super(menuService, injector, authorizationService, route, themeService);
    this.menuVisibleWithSections$ = this.menuService.getMenuTopSections(MenuID.DSO_EDIT).pipe(
      switchMap((sections) => {
        if (sections.length === 0) {return of(false);}
        return combineLatest(
          sections.map((section) =>
            this.menuService.getSubSectionsByParentID(MenuID.DSO_EDIT, section.id).pipe(
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
