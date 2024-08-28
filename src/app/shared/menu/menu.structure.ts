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

export const MENU_PROVIDER = new InjectionToken<AbstractMenuProvider>('MENU_PROVIDER');

type MenuStructure = {
  [key in MenuID]: (Type<AbstractMenuProvider> | {providerType: Type<AbstractMenuProvider>, paths: string[]})[];
};

export function buildMenuStructure(structure: MenuStructure): Provider[] {
  const providers: Provider[] = [
    MenuProviderService,
  ];

  Object.entries(structure).forEach(([menuID, providerTypes]) => {
    for (const [index, providerType] of providerTypes.entries()) {
      // todo: should complain if not injectable!

      if (providerType.hasOwnProperty('providerType')) {
        const providerPart = (providerType as any).providerType;
        const paths = (providerType as any).paths;


        providers.push(providerPart);
        providers.push({
          provide: MENU_PROVIDER,
          multi: true,
          useFactory(provider: AbstractMenuProvider): AbstractMenuProvider {
            provider.menuID = menuID as MenuID;
            provider.index = provider.index ?? index;
            provider.activePaths = paths;
            provider.shouldPersistOnRouteChange = false;
            return provider;
          },
          deps: [providerPart],
        });
      } else {
        providers.push(providerType as Type<AbstractMenuProvider> );
        providers.push({
          provide: MENU_PROVIDER,
          multi: true,
          useFactory(provider: AbstractMenuProvider): AbstractMenuProvider {
            provider.menuID = menuID as MenuID;
            provider.index = provider.index ?? index;
            return provider;
          },
          deps: [providerType],
        });
      }
    }
  });

  return providers;
}
