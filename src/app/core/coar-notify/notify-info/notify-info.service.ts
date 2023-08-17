import { Injectable } from '@angular/core';
import { getFirstSucceededRemoteData } from '../../shared/operators';
import { ConfigurationDataService } from '../../data/configuration-data.service';
import { map, Observable } from 'rxjs';

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
}
