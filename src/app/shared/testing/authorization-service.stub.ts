import { FeatureID } from '@core/data/feature-authorization/feature-id';
import {
  Observable,
  of,
} from 'rxjs';

export class AuthorizationDataServiceStub {
  isAuthorized(featureId?: FeatureID, objectUrl?: string, ePersonUuid?: string): Observable<boolean> {
    return of(false);
  }
}
