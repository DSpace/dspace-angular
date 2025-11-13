import { ConfigurationProperty } from '../shared/configuration-property.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

export function getMockFindByIdDataService(propertyKey: string, ...values: string[]) {
  return jasmine.createSpyObj('findByIdDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: propertyKey,
      values: values,
    }),
  });
}


