import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuItemType, MenuID } from './shared/menu/initial-menus-state';
import { LinkMenuItemModel } from './shared/menu/menu-item/models/link.model';
import { getFirstCompletedRemoteData } from './core/shared/operators';
import { PaginatedList } from './core/data/paginated-list.model';
import { BrowseDefinition } from './core/shared/browse-definition.model';
import { RemoteData } from './core/data/remote-data';
import { TextMenuItemModel } from './shared/menu/menu-item/models/text.model';
import { BrowseService } from './core/browse/browse.service';
import { MenuService } from './shared/menu/menu.service';
import { MenuState } from './shared/menu/menu.reducer';
import { find, map } from 'rxjs/operators';
import { hasValue } from './shared/empty.util';

@Injectable({
  providedIn: 'root'
})
export class MenuResolver implements Resolve<boolean> {
  constructor(
    protected menuService: MenuService,
    public browseService: BrowseService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.createPublicMenu();
    return this.menuService.getMenu(MenuID.PUBLIC).pipe(
      find((menu: MenuState) => hasValue(menu)),
      map(() => true)
    );
  }

  createPublicMenu() {
    const menuList: any[] = [
      /* Communities & Collections tree */
      {
        id: `browse_global_communities_and_collections`,
        active: false,
        visible: true,
        index: 0,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.browse_global_communities_and_collections`,
          link: `/community-list`
        } as LinkMenuItemModel
      }
    ];
    // Read the different Browse-By types from config and add them to the browse menu
    this.browseService.getBrowseDefinitions()
      .pipe(getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>())
      .subscribe((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {
        if (browseDefListRD.hasSucceeded) {
          browseDefListRD.payload.page.forEach((browseDef: BrowseDefinition) => {
            menuList.push({
              id: `browse_global_by_${browseDef.id}`,
              parentID: 'browse_global',
              active: false,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.browse_global_by_${browseDef.id}`,
                link: `/browse/${browseDef.id}`
              } as LinkMenuItemModel
            });
          });
          menuList.push(
            /* Browse */
            {
              id: 'browse_global',
              active: false,
              visible: true,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: 'menu.section.browse_global'
              } as TextMenuItemModel,
            }
          );
        }
        menuList.forEach((menuSection) => this.menuService.addSection(MenuID.PUBLIC, Object.assign(menuSection, {
          shouldPersistOnRouteChange: true
        })));
      });

  }

}
