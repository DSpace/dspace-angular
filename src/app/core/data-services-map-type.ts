import {
  InjectionToken,
  Type,
} from '@angular/core';

import { HALDataService } from './data/base/hal-data-service.interface';

export type LazyDataServicesMap = Map<string, () => Promise<Type<HALDataService<any>> | {
  default: HALDataService<any>
}>>;
export const APP_DATA_SERVICES_MAP: InjectionToken<LazyDataServicesMap> = new InjectionToken<LazyDataServicesMap>('APP_DATA_SERVICES_MAP');
