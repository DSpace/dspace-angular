import { InjectionToken } from '@angular/core';
import { GenericConstructor } from '@dspace/core/shared/generic-constructor';

import { HALDataService } from './data/base/hal-data-service.interface';

export type LazyDataServicesMap = Map<string, () => Promise<GenericConstructor<HALDataService<any>> | { default: GenericConstructor<HALDataService<any>> }>>;

export const APP_DATA_SERVICES_MAP: InjectionToken<LazyDataServicesMap> = new InjectionToken<LazyDataServicesMap>('APP_DATA_SERVICES_MAP');
