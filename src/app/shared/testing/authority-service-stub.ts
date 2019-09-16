import { of as observableOf } from 'rxjs';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../core/integration/integration-data';
import { PageInfo } from '../../core/shared/page-info.model';
import { AuthorityEntry } from '../../core/integration/models/authority-entry.model';
import { Authority } from '../../core/integration/models/authority.model';
import { RemoteData } from '../../core/data/remote-data';

export class AuthorityServiceStub {

  private mockAuthority: Authority = Object.assign(new Authority(), {
    id: 'common_types',
    name: 'common_types',
    scrollable: false,
    hierarchical: false,
    preloadLevel: 0,
    type: 'authority'
  });

  private _payload = [
    Object.assign(new AuthorityEntry(),{id: 1, display: 'one', value: 1}),
    Object.assign(new AuthorityEntry(),{id: 2, display: 'two', value: 2}),
  ];

  setNewPayload(payload) {
    this._payload = payload;
  }

  getEntriesByName(options: IntegrationSearchOptions) {
    return observableOf(new IntegrationData(new PageInfo(), this._payload));
  }

  findById(id: string) {
    return observableOf(
      new RemoteData(false, false, true, null, this.mockAuthority)
    );
  }
}
