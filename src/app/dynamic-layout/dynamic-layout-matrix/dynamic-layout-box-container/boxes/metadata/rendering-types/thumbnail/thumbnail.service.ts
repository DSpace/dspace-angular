import { Injectable } from '@angular/core';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';



/**
 * Set up Google Analytics on the client side.
 * See: {@link addTrackingIdToPage}.
 */
@Injectable({ providedIn: 'root' })
export class ThumbnailService {

  constructor(
    private configService: ConfigurationDataService,
  ) { }

  /**
   * Call this method once when Angular initializes on the client side.
   * It requests Thumbnail Maximum Size from the rest backend
   * (property: dspace.layout.thumbnail.maxsize)
   */
  getConfig(): Observable<RemoteData<ConfigurationProperty>> {
    return this.configService.findByPropertyName('dynamic.layout.thumbnail.maxsize').pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
