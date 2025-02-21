import { ConfigurationProperty } from '../../../../modules/core/src/lib/core/shared/configuration-property.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../modules/core/src/lib/core/utilities/remote-data.utils';

export function getMockFindByIdDataService(propertyKey: string, ...values: string[]) {
  return jasmine.createSpyObj('findByIdDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$({
      ... new ConfigurationProperty(),
      name: propertyKey,
      values: values,
    }),
  });
}


