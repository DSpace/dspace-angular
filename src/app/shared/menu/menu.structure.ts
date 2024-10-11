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
import { MenuID } from './menu-id.model';
import { AbstractMenuProvider } from './menu-provider';
import { MenuProviderService } from './menu-provider.service';
import { hasValue, isNotEmpty } from '../empty.util';

export const MENU_PROVIDER = new InjectionToken<AbstractMenuProvider>('MENU_PROVIDER');

type MenuStructure = {
  [key in MenuID]: (Type<AbstractMenuProvider> | {providerType: Type<AbstractMenuProvider>, paths: string[]} | {providerType: Type<AbstractMenuProvider>, childProviderTypes: any[]})[];
};

function resolveProvider(providerType: Type<AbstractMenuProvider> , menuID: string, index: number, paths?: string[], parentID?: string, childProviders? : Type<AbstractMenuProvider>[]) {
  return {
    provide: MENU_PROVIDER,
    multi: true,
    useFactory(provider: AbstractMenuProvider): AbstractMenuProvider {
      provider.menuID = menuID as MenuID;
      provider.index = provider.index ?? index;
      if (hasValue(parentID)) {
        provider.menuProviderId = `${parentID}_${provider.constructor.name}-${provider.index}`
        provider.parentID = parentID;
      } else {
        provider.menuProviderId = `${provider.constructor.name}-${provider.index}`;
      }
      if (isNotEmpty(paths)) {
        provider.activePaths = paths;
        provider.shouldPersistOnRouteChange = false;
      }
      if (isNotEmpty(childProviders)) {
        provider.shouldPersistOnRouteChange = false;
      }
      return provider;
    },
    deps: [providerType],
  };
}

export function buildMenuStructure(structure: MenuStructure): Provider[] {
  const providers: Provider[] = [
    MenuProviderService,
  ];

  Object.entries(structure).forEach(([menuID, providerTypes]) => {
    for (const [index, providerType] of providerTypes.entries()) {
      // todo: should complain if not injectable!

      if (providerType.hasOwnProperty('providerType') && providerType.hasOwnProperty('paths')) {
        const providerPart = (providerType as any).providerType;
        const paths = (providerType as any).paths;
        providers.push(providerPart);
        providers.push(resolveProvider(providerPart, menuID, index, paths));
      } else if (providerType.hasOwnProperty('providerType') && providerType.hasOwnProperty('childProviderTypes')){
        const providerPart = (providerType as any).providerType;

        const childProviderList = [];
        const childProviderTypes = (providerType as any).childProviderTypes;
        childProviderTypes.forEach((childProviderType, childIndex: number) => {


          if (childProviderType.hasOwnProperty('providerType') && childProviderType.hasOwnProperty('paths')) {
            const childProviderTypePart = (childProviderType as any).providerType;
            const paths = (childProviderType as any).paths;
            providers.push(childProviderTypePart);
            providers.push(resolveProvider(childProviderTypePart, menuID, childIndex, paths, `${providerPart.name}-${index}`))
            childProviderList.push(childProviderTypePart);
          } else {
            providers.push(childProviderType)
            providers.push(resolveProvider(childProviderType, menuID, childIndex, undefined, `${providerPart.name}-${index}`))
            childProviderList.push(childProviderType);
          }
        })

        providers.push(providerPart);
        providers.push(resolveProvider(providerPart, menuID, index, undefined, undefined, childProviderList));


      } else {
        providers.push(providerType as Type<AbstractMenuProvider> );
        providers.push(resolveProvider(providerType as Type<AbstractMenuProvider>, menuID, index));
      }
    }
  });

  return providers;
}
