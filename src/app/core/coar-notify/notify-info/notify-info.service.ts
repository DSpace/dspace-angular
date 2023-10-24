import { Injectable } from '@angular/core';
import { getFirstSucceededRemoteData, getRemoteDataPayload } from '../../shared/operators';
import { ConfigurationDataService } from '../../data/configuration-data.service';
import { map, Observable } from 'rxjs';
import { DefaultAppConfig } from '../../../../config/default-app-config';
import { ConfigurationProperty } from '../../shared/configuration-property.model';

@Injectable({
    providedIn: 'root'
})
export class NotifyInfoService {

    /**
     *  The relation link for the inbox
     */
    private _inboxRelationLink = 'http://www.w3.org/ns/ldp#inbox';

    constructor(
        private configService: ConfigurationDataService,
    ) {}

    isCoarConfigEnabled(): Observable<boolean> {
        return this.configService.findByPropertyName('coar-notify.enabled').pipe(
            getFirstSucceededRemoteData(),
            map(response => {
                const booleanArrayValue = response.payload.values;
                const coarConfigEnabled = booleanArrayValue.length > 0 ? booleanArrayValue[0] === 'true' : false;
                return coarConfigEnabled;
            })
        );
    }

    /**
     * Get the url of the local inbox from the REST configuration
     * @returns the url of the local inbox
     */
    getCoarLdnLocalInboxUrls(): Observable<string[]> {
      return this.configService.findByPropertyName('ldn.notify.local-inbox-endpoint').pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
        map((response: ConfigurationProperty) => {
          return response.values;
        })
      );
    }

    getCoarLdnRestApiUrl(): string {
        const appConfig = new DefaultAppConfig();
        const restConfig = appConfig.rest;

        const ssl = restConfig.ssl;
        const host = restConfig.host;
        const port = restConfig.port;
        const namespace = restConfig.nameSpace;

        return `${ssl ? 'https' : 'http'}://${host}:${port}${namespace}`;
    }

    /**
     * Method to get the relation link for the inbox
     * @returns the relation link for the inbox
     */
    getInboxRelationLink(): string {
      return this._inboxRelationLink;
    }
}
