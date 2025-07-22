import { RemoteData } from '@core/data/remote-data';
import { ConfigurationProperty } from '@core/shared/configuration-property.model';
import { Observable } from 'rxjs';

import { createSuccessfulRemoteDataObject$ } from '../remote-data.utils';

export class ConfigurationDataServiceStub {

  findByPropertyName(_name: string): Observable<RemoteData<ConfigurationProperty>> {
    const configurationProperty = new ConfigurationProperty();
    configurationProperty.values = [];
    return createSuccessfulRemoteDataObject$(configurationProperty);
  }

}
