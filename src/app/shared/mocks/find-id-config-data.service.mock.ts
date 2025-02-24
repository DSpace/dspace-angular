import {
  ConfigurationProperty,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core';

export function getMockFindByIdDataService(propertyKey: string, ...values: string[]) {
  return jasmine.createSpyObj('findByIdDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: propertyKey,
      values: values,
    }),
  });
}


