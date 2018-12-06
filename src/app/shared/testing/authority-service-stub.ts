import { Observable, of as observableOf } from 'rxjs';

import { IntegrationData } from '../../core/integration/integration-data';
import { AuthorityValueModel } from '../../core/integration/models/authority-value.model';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { PageInfo } from '../../core/shared/page-info.model';

export class AuthorityServiceStub {

  private _payload = [
    Object.assign(new AuthorityValueModel(),{id: 1, display: 'one', value: 1}),
    Object.assign(new AuthorityValueModel(),{id: 2, display: 'two', value: 2}),
  ];

  setNewPayload(payload) {
    this._payload = payload;
  }

  getEntriesByName(options: IntegrationSearchOptions) {
    return observableOf(new IntegrationData(new PageInfo(), this._payload));
  }
}
