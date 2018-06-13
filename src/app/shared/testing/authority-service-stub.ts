import { Observable } from 'rxjs/Observable';
import { IntegrationSearchOptions } from '../../core/integration/models/integration-options.model';
import { IntegrationData } from '../../core/integration/integration-data';
import { PageInfo } from '../../core/shared/page-info.model';

export class AuthorityServiceStub {

  getEntriesByName(options: IntegrationSearchOptions) {
    const payload = [{id: 1, display: 'one', value: 1} as any, {id: 2, display: 'two', value: 2} as any];
    return Observable.of(new IntegrationData(new PageInfo(), payload));
  }
}
