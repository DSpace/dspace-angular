import { Observable } from 'rxjs';

import { RemoteData } from '../../data';
import { ConfigurationProperty } from '../../shared';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';

export class ConfigurationDataServiceStub {

  findByPropertyName(_name: string): Observable<RemoteData<ConfigurationProperty>> {
    const configurationProperty = new ConfigurationProperty();
    configurationProperty.values = [];
    return createSuccessfulRemoteDataObject$(configurationProperty);
  }

}
