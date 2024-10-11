/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { combineLatest, Observable, of as observableOf, } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AbstractMenuProvider,
  MenuProvider,
  MenuProviderTypeWithPaths,
  MenuProviderTypeWithSubs,
} from '../menu-provider';
import { Inject, Injector, Optional, Type } from '@angular/core';
import { AbstractExpandableMenuProvider, MenuSubSection } from './expandable-menu-provider';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { isEmpty } from '../../empty.util';
import { MENU_PROVIDER } from '../menu.structure';
import { MenuService } from '../menu.service';


export abstract class AbstractExpandableParentMenuProvider extends AbstractMenuProvider {
  isExpandable = true;

  public static withSubs(childProviders: (Type<MenuProvider>| MenuProviderTypeWithPaths)[]) {
    if (!AbstractMenuProvider.isPrototypeOf(this)) {
      throw new Error(
        'onRoute should only be called from concrete subclasses of AbstractMenuProvider'
      );
    }

    const providerType = this as unknown as Type<AbstractMenuProvider>;
    return {providerType: providerType, childProviderTypes: childProviders};
  }
}
