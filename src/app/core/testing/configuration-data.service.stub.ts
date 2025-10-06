import { Observable } from 'rxjs';

import { RemoteData } from '../data/remote-data';
import { ConfigurationProperty } from '../shared/configuration-property.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

export class ConfigurationDataServiceStub {

  findByPropertyName(_name: string): Observable<RemoteData<ConfigurationProperty>> {
    const configurationProperty = new ConfigurationProperty();
    configurationProperty.values = [];
    return createSuccessfulRemoteDataObject$(configurationProperty);
  }

}
