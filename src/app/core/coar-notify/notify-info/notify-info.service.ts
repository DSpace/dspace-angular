import { Injectable } from '@angular/core';
import { getFirstSucceededRemoteData } from '../../shared/operators';
import { ConfigurationDataService } from '../../data/configuration-data.service';
import { map, Observable } from 'rxjs';
import { DefaultAppConfig } from '../../../../config/default-app-config';

@Injectable({
    providedIn: 'root'
})
export class NotifyInfoService {

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

    getCoarLdnRestApiUrl(): string {
        const appConfig = new DefaultAppConfig();
        const restConfig = appConfig.rest;

        const ssl = restConfig.ssl;
        const host = restConfig.host;
        const port = restConfig.port;
        const namespace = restConfig.nameSpace;

        return `${ssl ? 'https' : 'http'}://${host}:${port}${namespace}`;
    }
}
