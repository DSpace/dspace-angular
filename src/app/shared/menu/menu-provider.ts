/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
/* eslint-disable max-classes-per-file */
import { ActivatedRouteSnapshot, RouterStateSnapshot, } from '@angular/router';
import flatten from 'lodash/flatten';
import { combineLatest, Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuID } from './menu-id.model';
import { MenuItemModels } from './menu-section.model';
import { Type } from '@angular/core';

export interface PartialMenuSection {
  id?: string;
  visible: boolean;
  model: MenuItemModels;
  parentID?: string;
  index?: number;
  active?: boolean;
  shouldPersistOnRouteChange?: boolean;
  icon?: string;
  alwaysRenderExpandable?: boolean;
}


export interface MenuProvider {
  shouldPersistOnRouteChange?: boolean,
  menuID?: MenuID;
  index?: number;

  getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;
}

export class MenuProviderTypeWithOptions {
  providerType: Type<MenuProvider>;
  paths?: string[];
  childProviderTypes?: (Type<MenuProvider> | MenuProviderTypeWithOptions)[];

}

export abstract class AbstractMenuProvider implements MenuProvider {

  /**
   * ID of the menu this provider is part of
   * If not set up, this will be set based on the provider class name
   */
  menuID?: MenuID;

  /**
   * Whether the sections of this menu should be set on the
   */
  shouldPersistOnRouteChange = true;
  menuProviderId?: string;
  index?: number;
  activePaths?: string[];
  parentID?: string;

  /**
   * Whether the menu section or top section of this provider will always be rendered as expandable and hidden when no children are present
   */
  alwaysRenderExpandable? = false;


  public static onRoute(...paths: string[]): MenuProviderTypeWithOptions {
    if (!AbstractMenuProvider.isPrototypeOf(this)) {
      throw new Error(
        'onRoute should only be called from concrete subclasses of AbstractMenuProvider'
      );
    }

    const providerType = this as unknown as Type<AbstractMenuProvider>;
    return {providerType: providerType, paths: paths};
  }

  /**
   * Method to add sub menu providers to this top provider
   * @param childProviders - the list of sub providers that will provide subsections for this provider
   */
  public static withSubs(childProviders: (Type<MenuProvider> | MenuProviderTypeWithOptions)[]): MenuProviderTypeWithOptions {
    if (!AbstractMenuProvider.isPrototypeOf(this)) {
      throw new Error(
        'withSubs should only be called from concrete subclasses of AbstractMenuProvider'
      );
    }

    const providerType = this as unknown as Type<AbstractMenuProvider>;
    return {providerType: providerType, childProviderTypes: childProviders};
  }

  abstract getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;

  protected concat(...sections$: Observable<PartialMenuSection[]>[]): Observable<PartialMenuSection[]> {
    return combineLatest(sections$).pipe(
      map(sections => flatten(sections)),
    );
  }
}


