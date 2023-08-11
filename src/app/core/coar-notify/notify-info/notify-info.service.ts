import { Injectable } from '@angular/core';
import { getFirstSucceededRemoteData } from '../../shared/operators';
import { ConfigurationDataService } from '../../data/configuration-data.service';


@Injectable({
  providedIn: 'root'
})
export class NotifyInfoService {

  constructor(
      private configService: ConfigurationDataService,
  ) {
  }

  isCoarConfigEnabled(): boolean {
    this.configService.findByPropertyName('coar-notify.enabled').pipe(
      getFirstSucceededRemoteData()
    );
    if (!getFirstSucceededRemoteData()) {
      return true;
    }
  }
}
