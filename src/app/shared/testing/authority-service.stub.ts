import {of as observableOf,  Observable } from 'rxjs';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../core/integration/integration-data';
import { PageInfo } from '../../core/shared/page-info.model';
import { AuthorityValue } from '../../core/integration/models/authority.value';

export class AuthorityServiceStub {

  private _payload = [
    Object.assign(new AuthorityValue(),{id: 1, display: 'one', value: 1}),
    Object.assign(new AuthorityValue(),{id: 2, display: 'two', value: 2}),
  ];

  setNewPayload(payload) {
    this._payload = payload;
  }

  getEntriesByName(options: IntegrationSearchOptions) {
    return observableOf(new IntegrationData(new PageInfo(), this._payload));
  }
}
