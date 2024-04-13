import { Injectable } from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';

import { ConfigurationDataService } from '../../data/configuration-data.service';
import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../data/feature-authorization/feature-id';
import { RemoteData } from '../../data/remote-data';
import { ConfigurationProperty } from '../../shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '../../shared/operators';

/**
 * Service to check COAR availability and LDN services information for the COAR Notify functionalities
 */
@Injectable({
  providedIn: 'root',
})
export class NotifyInfoService {

  /**
     *  The relation link for the inbox
     */
  private _inboxRelationLink = 'http://www.w3.org/ns/ldp#inbox';

  constructor(
        private configService: ConfigurationDataService,
        protected authorizationService: AuthorizationDataService,
  ) {}

  isCoarConfigEnabled(): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CoarNotifyEnabled);
  }

  /**
     * Get the url of the local inbox from the REST configuration
     * @returns the url of the local inbox
     */
  getCoarLdnLocalInboxUrls(): Observable<string[]> {
    return this.configService.findByPropertyName('ldn.notify.inbox').pipe(
      getFirstCompletedRemoteData(),
      map((responseRD: RemoteData<ConfigurationProperty>) => responseRD.hasSucceeded ? responseRD.payload.values : []),
    );
  }

  /**
     * Method to get the relation link for the inbox
     * @returns the relation link for the inbox
     */
  getInboxRelationLink(): string {
    return this._inboxRelationLink;
  }
}
