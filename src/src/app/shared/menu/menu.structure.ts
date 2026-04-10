/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  InjectionToken,
  Provider,
  Type,
} from '@angular/core';

import {
  hasValue,
  isNotEmpty,
} from '../empty.util';
import { MenuID } from './menu-id.model';
import {
  AbstractMenuProvider,
  MenuProviderTypeWithOptions,
} from './menu-provider.model';
import { MenuRoute } from './menu-route.model';

export const MENU_PROVIDER = new InjectionToken<AbstractMenuProvider>('MENU_PROVIDER');

type MenuStructure = {
  [key in MenuID]: (Type<AbstractMenuProvider> | MenuProviderTypeWithOptions)[];
};

/**
 * Builds the menu structure by converting the provider types into resolved providers
 * @param structure - The app menus structure
 */
export function buildMenuStructure(structure: MenuStructure): Provider[] {
  const providers: Provider[] = [
  ];

  Object.entries(structure).forEach(([menuID, providerTypes]) => {
    for (const [index, providerType] of providerTypes.entries()) {
      processProviderType(providers, menuID, providerType, index);
    }
  });

  return providers;
}

/**
 * Process a single provider type and add it to the list of providers
 * When the provider type contains paths, the paths will be added to resolved provider
 * When the provider type has sub provider, the sub providers will be processed with the current provider type as parent
 * @param providers - The list of providers
 * @param providerType  - The provider to resolve and add to the list
 * @param menuID  - The ID of the menu to which the provider belongs
 * @param index - The index of the provider
 * @param parentID  - The ID of the parent provider if relevant
 * @param hasSubProviders - Whether this provider has sub providers
 */
function processProviderType(providers: Provider[], menuID: string, providerType: Type<AbstractMenuProvider> | MenuProviderTypeWithOptions, index: number, parentID?: string, hasSubProviders?: boolean) {
  if (providerType.hasOwnProperty('providerType') && providerType.hasOwnProperty('childProviderTypes')) {
    const providerPart = (providerType as any).providerType;
    const childProviderTypes = (providerType as any).childProviderTypes;

    childProviderTypes.forEach((childProviderType, childIndex: number) => {
      processProviderType(providers, menuID, childProviderType, childIndex, `${menuID}_${index}_0`, hasSubProviders);
    });
    processProviderType(providers, menuID, providerPart, index, parentID, true);

  } else if (providerType.hasOwnProperty('providerType') && providerType.hasOwnProperty('paths')) {
    const providerPart = (providerType as any).providerType;
    const paths = (providerType as any).paths;
    addProviderToList(providers, providerPart, menuID, index, parentID, hasSubProviders, paths);
  } else {
    addProviderToList(providers, providerType as Type<AbstractMenuProvider>, menuID, index, parentID, hasSubProviders);
  }
}

/**
 * Resolves and adds a provider to a list of providers
 * @param providers - The list of providers
 * @param providerType  - The provider to resolve and add to the list
 * @param menuID  - The ID of the menu to which the provider belongs
 * @param index - The index of the provider
 * @param parentID  - The ID of the parent provider if relevant
 * @param hasSubProviders - Whether this provider has sub providers
 * @param paths - The paths this provider should be active on if relevant
 */
function addProviderToList(providers: Provider[], providerType: Type<AbstractMenuProvider>, menuID: string, index: number, parentID?: string, hasSubProviders?: boolean, paths?: MenuRoute[]) {
  const resolvedProvider =  {
    provide: MENU_PROVIDER,
    multi: true,
    useFactory(provider: AbstractMenuProvider): AbstractMenuProvider {
      provider.menuID = menuID as MenuID;
      provider.index = provider.index ?? index;
      if (hasValue(parentID)) {
        provider.menuProviderId =  provider.menuProviderId ?? `${parentID}_${index}`;
        let providerParentID = provider.parentID;
        if (hasValue(providerParentID)) {
          providerParentID = `${providerParentID}_0`;
        }
        provider.parentID = providerParentID ?? parentID;
      } else {
        provider.menuProviderId = provider.menuProviderId ?? `${menuID}_${index}`;
      }
      if (isNotEmpty(paths)) {
        provider.activePaths = paths;
        provider.shouldPersistOnRouteChange = false;
      }
      if (hasSubProviders) {
        provider.shouldPersistOnRouteChange = false;
      }
      return provider;
    },
    deps: [providerType],
  };
  providers.push(resolvedProvider);
  providers.push(providerType);
}
