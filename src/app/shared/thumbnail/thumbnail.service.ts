import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';

/**
 * Set up Google Analytics on the client side.
 * See: {@link addTrackingIdToPage}.
 */
@Injectable()
export class ThumbnailService {

  constructor(
    private configService: ConfigurationDataService,
  ) { }

  /**
   * Call this method once when Angular initializes on the client side.
   * It requests Thumbnail Maximum Size from the rest backend
   * (property: cris.layout.thumbnail.maxsize)
   */
  getConfig(): Observable<RemoteData<ConfigurationProperty>> {
    return this.configService.findByPropertyName('cris.layout.thumbnail.maxsize').pipe(
      getFirstCompletedRemoteData(),
    );
  }
}
