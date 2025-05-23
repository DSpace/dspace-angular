import {
  Observable,
  of,
} from 'rxjs';

import { FeatureID } from '../../core/data/feature-authorization/feature-id';

export class AuthorizationDataServiceStub {
  isAuthorized(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string): Observable<boolean> {
    return of(false);
  }
}
