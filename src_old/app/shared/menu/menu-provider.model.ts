/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
/* eslint-disable max-classes-per-file */
import { Type } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { MenuID } from './menu-id.model';
import { MenuRoute } from './menu-route.model';
import { MenuItemModels } from './menu-section.model';

/**
 * Partial menu section
 * This object acts like a menu section but with certain properties being optional
 */
export interface PartialMenuSection {
  id?: string;
  accessibilityHandle?: string;
  visible: boolean;
  model: MenuItemModels;
  parentID?: string;
  active?: boolean;
  shouldPersistOnRouteChange?: boolean;
  icon?: string;
  alwaysRenderExpandable?: boolean;
}

/**
 * Interface to represent a menu provider
 * Implementations of this provider will contain sections to be added to the menus
 */
export interface MenuProvider {
  shouldPersistOnRouteChange?: boolean,
  menuID?: MenuID;
  index?: number;

  /**
   * Retrieve the sections from the provider. These sections can be route dependent.
   * @param route - The route on which the menu sections possibly depend
   * @param state - The router snapshot on which the sections possibly depend
   */
  getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;
}

/**
 * Class to represent a Menu Provider together with additional information added through the static methods on
 * AbstractMenuProvider. This additional information is either the paths on which the sections of this provider should
 * be present or a list of child providers
 */
export class MenuProviderTypeWithOptions {
  providerType: Type<MenuProvider>;
  paths?: MenuRoute[];
  childProviderTypes?: (Type<MenuProvider> | MenuProviderTypeWithOptions)[];

}

/**
 * Abstract class to be extended when creating menu providers
 */
export abstract class AbstractMenuProvider implements MenuProvider {

  /**
   * ID of the menu this provider is part of
   * This will be set to the menu ID of the menu in which it is present in the app.menus.ts file
   */
  menuID?: MenuID;

  /**
   * Whether the sections of this menu should be set on the
   */
  shouldPersistOnRouteChange = true;

  /**
   * The ID of the menu provider.
   * This will be automatically set based on the menu and the index of the provider in the list
   */
  menuProviderId?: string;

  /**
   * The index of the menu provider
   * This will be automatically set based on the index of the provider in the list
   */
  index?: number;

  /**
   * The paths on which the sections of this provider will be active
   * This will be automatically set based on the paths added based on the paths provided through the 'onRoute' static
   * method in the app.menus.ts file
   */
  activePaths?: MenuRoute[];

  /**
   * The ID of the parent provider of this provider.
   * This will be automatically set based on the provider that calls the 'withSubs' static method with this provider
   * in the list of arguments
   */
  parentID?: string;

  /**
   * When true, the sections added by this provider will be assumed to be parent sections with children
   * The sections will not be rendered when they have no visible children
   * This can be overwritten on the level of sections
   */
  alwaysRenderExpandable? = false;

  /**
   * When true, this provider will only add its sections on Browser Side Rendering.
   */
  renderBrowserOnly? = false;

  /**
   * Static method to be called from the app.menus.ts file to define paths on which this provider should the active
   * @param paths - The paths on which the sections of this provider should be active
   */
  public static onRoute(...paths: MenuRoute[]): MenuProviderTypeWithOptions {
    if (!AbstractMenuProvider.isPrototypeOf(this)) {
      throw new Error(
        'onRoute should only be called from concrete subclasses of AbstractMenuProvider',
      );
    }

    const providerType = this as unknown as Type<AbstractMenuProvider>;
    return { providerType: providerType, paths: paths };
  }

  /**
   * Static method to be called from the app.menus.ts file to add sub menu providers to this top provider
   * @param childProviders - the list of sub providers that will provide subsections for this provider
   */
  public static withSubs(childProviders: (Type<MenuProvider> | MenuProviderTypeWithOptions)[]): MenuProviderTypeWithOptions {
    if (!AbstractMenuProvider.isPrototypeOf(this)) {
      throw new Error(
        'withSubs should only be called from concrete subclasses of AbstractMenuProvider',
      );
    }

    const providerType = this as unknown as Type<AbstractMenuProvider>;
    return { providerType: providerType, childProviderTypes: childProviders };
  }

  /**
   * Retrieve the sections from the provider. These sections can be route dependent.
   * @param route - The route on which the menu sections possibly depend
   * @param state - The router snapshot on which the sections possibly depend
   */
  abstract getSections(route?: ActivatedRouteSnapshot, state?: RouterStateSnapshot): Observable<PartialMenuSection[]>;

  protected getAutomatedSectionId(indexOfSectionInProvider: number): string {
    return `${this.menuProviderId}_${indexOfSectionInProvider}`;
  }

}


