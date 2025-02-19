import { Observable } from 'rxjs';

import { createSuccessfulRemoteDataObject$ } from '../../core/utilities/remote-data.utils';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';

export class ConfigurationDataServiceStub {

  findByPropertyName(_name: string): Observable<RemoteData<ConfigurationProperty>> {
    const configurationProperty = new ConfigurationProperty();
    configurationProperty.values = [];
    return createSuccessfulRemoteDataObject$(configurationProperty);
  }

}
