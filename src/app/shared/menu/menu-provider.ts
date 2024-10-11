/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Omit } from '@material-ui/core';
import flatten from 'lodash/flatten';
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuID } from './menu-id.model';
import { MenuItemModels, MenuSection } from './menu-section.model';
import { APP_INITIALIZER, Provider, Type } from '@angular/core';
import { APP_CONFIG } from '../../../config/app-config.interface';
import { TransferState } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { HOME_PAGE_PATH } from '../../app-routing-paths';
import { MENU_PROVIDER } from './menu.structure';

// export type PartialMenuSection = Omit<MenuSection, 'id' | 'active'>;
export interface PartialMenuSection {
  id?: string;
  visible: boolean;
  model: MenuItemModels;
  parentID?: string;
  index?: number;
  active?: boolean;
  shouldPersistOnRouteChange?: boolean;
  icon?: string;
  isExpandable?: boolean;
}



export interface MenuProvider {
  shouldPersistOnRouteChange?: boolean,
  menuID?: MenuID;
  index?: number;

  getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;
}

export class MenuProviderTypeWithPaths {
  providerType: Type<MenuProvider>;
  paths:  string[];
}

export class MenuProviderTypeWithSubs {
  providerType: Type<MenuProvider>;
  childProviderTypes:  (Type<MenuProvider> | MenuProviderTypeWithPaths)[];
}

export abstract class AbstractMenuProvider implements MenuProvider {
  shouldPersistOnRouteChange = true;
  menuID?: MenuID;
  menuProviderId?: string;
  index?: number;
  activePaths?: string[];
  parentID?: string;
  isExpandable = false;


  abstract getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;

  protected concat(...sections$: Observable<PartialMenuSection[]>[]): Observable<PartialMenuSection[]> {
    return combineLatest(sections$).pipe(
      map(sections => flatten(sections)),
    );
  }

  public static onRoute(...paths: string[]) {
    if (!AbstractMenuProvider.isPrototypeOf(this)) {
      throw new Error(
        'onRoute should only be called from concrete subclasses of AbstractMenuProvider'
      );
    }

    const providerType = this as unknown as Type<AbstractMenuProvider>;
    return {providerType: providerType, paths: paths};
  }
}


