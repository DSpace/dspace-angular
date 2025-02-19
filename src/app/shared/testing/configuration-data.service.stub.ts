import { Observable } from 'rxjs';

import { createSuccessfulRemoteDataObject$ } from '../../../../modules/shared/utils/src/lib/utils/remote-data.utils';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';

export class ConfigurationDataServiceStub {

  findByPropertyName(_name: string): Observable<RemoteData<ConfigurationProperty>> {
    const configurationProperty = new ConfigurationProperty();
    configurationProperty.values = [];
    return createSuccessfulRemoteDataObject$(configurationProperty);
  }

}
