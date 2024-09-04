import { Injectable } from '@angular/core';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';
import { ResponsiveColumnSizes } from '../../../shared/responsive-table-sizes/responsive-column-sizes';
import { RemoteData } from '../../../core/data/remote-data';
import { isNotEmpty, hasValue } from '../../../shared/empty.util';
import { Bundle } from '../../../core/shared/bundle.model';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, zip as observableZip } from 'rxjs';
import { NoContent } from '../../../core/shared/NoContent.model';
import { take, switchMap, map } from 'rxjs/operators';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { BitstreamTableEntry } from './item-edit-bitstream-bundle/item-edit-bitstream-bundle.component';
import { getFirstSucceededRemoteDataPayload } from '../../../core/shared/operators';
import { getBitstreamDownloadRoute } from '../../../app-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';

@Injectable(
  { providedIn: 'root' },
)
export class ItemBitstreamsService {

  constructor(
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected bitstreamService: BitstreamDataService,
    protected dsoNameService: DSONameService,
  ) {
  }

  /**
   * Returns the pagination options to use when fetching the bundles
   */
  getInitialBundlesPaginationOptions(): PaginationComponentOptions {
    return Object.assign(new PaginationComponentOptions(), {
      id: 'bundles-pagination-options',
      currentPage: 1,
      pageSize: 9999
    });
  }

  getInitialBitstreamsPaginationOptions(bundleName: string): PaginationComponentOptions {
    return Object.assign(new PaginationComponentOptions(),{
      id: bundleName, // This might behave unexpectedly if the item contains two bundles with the same name
      currentPage: 1,
      pageSize: 10
    });
  }

  /**
   * Returns the {@link ResponsiveTableSizes} for use in the columns of the edit bitstreams table
   */
  getColumnSizes(): ResponsiveTableSizes {
    return new ResponsiveTableSizes([
      // Name column
      new ResponsiveColumnSizes(2, 2, 3, 4, 4),
      // Description column
      new ResponsiveColumnSizes(2, 3, 3, 3, 3),
      // Format column
      new ResponsiveColumnSizes(2, 2, 2, 2, 2),
      // Actions column
      new ResponsiveColumnSizes(6, 5, 4, 3, 3)
    ]);
  }

  /**
   * Display notifications
   * - Error notification for each failed response with their message
   * - Success notification in case there's at least one successful response
   * @param key       The i18n key for the notification messages
   * @param responses The returned responses to display notifications for
   */
  displayNotifications(key: string, responses: RemoteData<any>[]) {
    if (isNotEmpty(responses)) {
      const failedResponses = responses.filter((response: RemoteData<Bundle>) => hasValue(response) && response.hasFailed);
      const successfulResponses = responses.filter((response: RemoteData<Bundle>) => hasValue(response) && response.hasSucceeded);

      failedResponses.forEach((response: RemoteData<Bundle>) => {
        this.notificationsService.error(this.translateService.instant(`${key}.failed.title`), response.errorMessage);
      });
      if (successfulResponses.length > 0) {
        this.notificationsService.success(this.translateService.instant(`${key}.saved.title`), this.translateService.instant(`${key}.saved.content`));
      }
    }
  }

  /**
   * Removes the bitstreams marked for deletion from the Bundles emitted by the provided observable.
   * @param bundles$
   */
  removeMarkedBitstreams(bundles$: Observable<Bundle[]>): Observable<RemoteData<NoContent>> {
    const bundlesOnce$ = bundles$.pipe(take(1));

    // Fetch all removed bitstreams from the object update service
    const removedBitstreams$ = bundlesOnce$.pipe(
      switchMap((bundles: Bundle[]) => observableZip(
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.getFieldUpdates(bundle.self, [], true))
      )),
      map((fieldUpdates: FieldUpdates[]) => ([] as FieldUpdate[]).concat(
        ...fieldUpdates.map((updates: FieldUpdates) => Object.values(updates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE))
      )),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field))
    );

    // Send out delete requests for all deleted bitstreams
    return removedBitstreams$.pipe(
      take(1),
      switchMap((removedBitstreams: Bitstream[]) => {
        return this.bitstreamService.removeMultiple(removedBitstreams);
      })
    );
  }

  mapBitstreamsToTableEntries(bitstreams: Bitstream[]): BitstreamTableEntry[] {
    return bitstreams.map((bitstream) => {
      const name = this.dsoNameService.getName(bitstream);

      return {
        bitstream: bitstream,
        id: bitstream.uuid,
        name: name,
        nameStripped: this.nameToHeader(name),
        description: bitstream.firstMetadataValue('dc.description'),
        format: bitstream.format.pipe(getFirstSucceededRemoteDataPayload()),
        downloadUrl: getBitstreamDownloadRoute(bitstream),
      };
    });
  }

  /**
   * Returns a string appropriate to be used as header ID
   * @param name
   */
  nameToHeader(name: string): string {
    // Whitespace is stripped from the Bitstream names for accessibility reasons.
    // To make it clear which headers are relevant for a specific field in the table, the 'headers' attribute is used to
    // refer to specific headers. The Bitstream's name is used as header ID for the row containing information regarding
    // that bitstream. As the 'headers' attribute contains a space-separated string of header IDs, the Bitstream's header
    // ID can not contain strings itself.
    return this.stripWhiteSpace(name);
  }

  /**
   * Returns a string equal to the input string with all whitespace removed.
   * @param str
   */
  stripWhiteSpace(str: string): string {
    // '/\s+/g' matches all occurrences of any amount of whitespace characters
    return str.replace(/\s+/g, '');
  }
}
