import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MoveOperation } from 'fast-json-patch';
import {
  BehaviorSubject,
  Observable,
  zip as observableZip,
} from 'rxjs';
import {
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { getBitstreamDownloadRoute } from '../../../app-routing-paths';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { RemoteData } from '../../../core/data/remote-data';
import { RequestService } from '../../../core/data/request.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../../core/shared/bitstream-format.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../core/shared/operators';
import {
  hasNoValue,
  hasValue,
} from '../../../shared/empty.util';
import { LiveRegionService } from '../../../shared/live-region/live-region.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { ResponsiveColumnSizes } from '../../../shared/responsive-table-sizes/responsive-column-sizes';
import { ResponsiveTableSizes } from '../../../shared/responsive-table-sizes/responsive-table-sizes';

export const MOVE_KEY = 'item.edit.bitstreams.notifications.move';

/**
 * Interface storing all the information necessary to create a row in the bitstream edit table
 */
export interface BitstreamTableEntry {
  /**
   * The bitstream
   */
  bitstream: Bitstream,
  /**
   * The uuid of the Bitstream
   */
  id: string,
  /**
   * The name of the Bitstream
   */
  name: string,
  /**
   * The name of the Bitstream with all whitespace removed
   */
  nameStripped: string,
  /**
   * The description of the Bitstream
   */
  description: string,
  /**
   * Observable emitting the Format of the Bitstream
   */
  format: Observable<BitstreamFormat>,
  /**
   * The download url of the Bitstream
   */
  downloadUrl: string,
}

/**
 * Interface storing information necessary to highlight and reorder the selected bitstream entry
 */
export interface SelectedBitstreamTableEntry {
  /**
   * The selected entry
   */
  bitstream: BitstreamTableEntry,
  /**
   * The bundle the bitstream belongs to
   */
  bundle: Bundle,
  /**
   * The total number of bitstreams in the bundle
   */
  bundleSize: number,
  /**
   * The original position of the bitstream within the bundle.
   */
  originalPosition: number,
  /**
   * The current position of the bitstream within the bundle.
   */
  currentPosition: number,
}

/**
 * Interface storing data regarding a change in selected bitstream
 */
export interface SelectionAction {
  /**
   * The different types of actions:
   *  - Selected: Bitstream was selected
   *  - Moved: Bitstream was moved
   *  - Cleared: Selection was cleared, bitstream remains at its current position
   *  - Cancelled: Selection was cancelled, bitstream returns to its original position
   */
  action: 'Selected' | 'Moved' | 'Cleared' | 'Cancelled'
  /**
   * The table entry to which the selection action applies
   */
  selectedEntry: SelectedBitstreamTableEntry,
}

/**
 * This service handles the selection and updating of the bitstreams and their order on the
 * 'Edit Item' -> 'Bitstreams' page.
 */
@Injectable(
  { providedIn: 'root' },
)
export class ItemBitstreamsService {

  /**
   * BehaviorSubject which emits every time the selected bitstream changes.
   */
  protected selectionAction$: BehaviorSubject<SelectionAction> = new BehaviorSubject(null);

  protected isPerformingMoveRequest: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
    protected objectUpdatesService: ObjectUpdatesService,
    protected bitstreamService: BitstreamDataService,
    protected bundleService: BundleDataService,
    protected dsoNameService: DSONameService,
    protected requestService: RequestService,
    protected liveRegionService: LiveRegionService,
  ) {
  }

  /**
   * Returns the observable emitting the selection actions
   */
  getSelectionAction$(): Observable<SelectionAction> {
    return this.selectionAction$;
  }

  /**
   * Returns the latest selection action
   */
  getSelectionAction(): SelectionAction {
    const action = this.selectionAction$.value;

    if (hasNoValue(action)) {
      return null;
    }

    return Object.assign({}, action);
  }

  /**
   * Returns true if there currently is a selected bitstream
   */
  hasSelectedBitstream(): boolean {
    const selectionAction = this.getSelectionAction();

    if (hasNoValue(selectionAction)) {
      return false;
    }

    const action = selectionAction.action;

    return action === 'Selected' || action === 'Moved';
  }

  /**
   * Returns a copy of the currently selected bitstream
   */
  getSelectedBitstream(): SelectedBitstreamTableEntry {
    if (!this.hasSelectedBitstream()) {
      return null;
    }

    const selectionAction = this.getSelectionAction();
    return Object.assign({}, selectionAction.selectedEntry);
  }

  /**
   * Select the provided entry
   */
  selectBitstreamEntry(entry: SelectedBitstreamTableEntry) {
    if (hasValue(entry) && entry.bitstream !== this.getSelectedBitstream()?.bitstream) {
      this.announceSelect(entry.bitstream.name);
      this.updateSelectionAction({ action: 'Selected', selectedEntry: entry });
    }
  }

  /**
   * Makes the {@link selectionAction$} observable emit the provided {@link SelectedBitstreamTableEntry}.
   * @protected
   */
  protected updateSelectionAction(action: SelectionAction) {
    this.selectionAction$.next(action);
  }

  /**
   * Unselects the selected bitstream. Does nothing if no bitstream is selected.
   */
  clearSelection() {
    const selected = this.getSelectedBitstream();

    if (hasValue(selected)) {
      this.updateSelectionAction({ action: 'Cleared', selectedEntry: selected });
      this.announceClear(selected.bitstream.name);

      if (selected.currentPosition !== selected.originalPosition) {
        this.displaySuccessNotification(MOVE_KEY);
      }
    }
  }

  /**
   * Returns the currently selected bitstream to its original position and unselects the bitstream.
   * Does nothing if no bitstream is selected.
   */
  cancelSelection() {
    const selected = this.getSelectedBitstream();

    if (hasNoValue(selected) || this.getPerformingMoveRequest()) {
      return;
    }


    const originalPosition = selected.originalPosition;
    const currentPosition = selected.currentPosition;

    // If the selected bitstream has not moved, there is no need to return it to its original position
    if (currentPosition === originalPosition) {
      this.announceClear(selected.bitstream.name);
      this.updateSelectionAction({ action: 'Cleared', selectedEntry: selected });
    } else {
      this.announceCancel(selected.bitstream.name, originalPosition);
      this.performBitstreamMoveRequest(selected.bundle, currentPosition, originalPosition);
      this.updateSelectionAction({ action: 'Cancelled', selectedEntry: selected });
    }
  }

  /**
   * Moves the selected bitstream one position up in the bundle. Does nothing if no bitstream is selected or the
   * selected bitstream already is at the beginning of the bundle.
   */
  moveSelectedBitstreamUp() {
    const selected = this.getSelectedBitstream();

    if (hasNoValue(selected) || this.getPerformingMoveRequest()) {
      return;
    }

    const originalPosition = selected.currentPosition;
    if (originalPosition > 0) {
      const newPosition = originalPosition - 1;
      selected.currentPosition = newPosition;

      const onRequestCompleted = () => {
        this.announceMove(selected.bitstream.name, newPosition);
      };

      this.performBitstreamMoveRequest(selected.bundle, originalPosition, newPosition, onRequestCompleted);
      this.updateSelectionAction({ action: 'Moved', selectedEntry: selected });
    }
  }

  /**
   * Moves the selected bitstream one position down in the bundle. Does nothing if no bitstream is selected or the
   * selected bitstream already is at the end of the bundle.
   */
  moveSelectedBitstreamDown() {
    const selected = this.getSelectedBitstream();

    if (hasNoValue(selected) || this.getPerformingMoveRequest()) {
      return;
    }

    const originalPosition = selected.currentPosition;
    if (originalPosition < selected.bundleSize - 1) {
      const newPosition = originalPosition + 1;
      selected.currentPosition = newPosition;

      const onRequestCompleted = () => {
        this.announceMove(selected.bitstream.name, newPosition);
      };

      this.performBitstreamMoveRequest(selected.bundle, originalPosition, newPosition, onRequestCompleted);
      this.updateSelectionAction({ action: 'Moved', selectedEntry: selected });
    }
  }

  /**
   * Sends out a Move Patch request to the REST API, display notifications,
   * refresh the bundle's cache (so the lists can properly reload)
   * @param bundle The bundle to send patch requests to
   * @param fromIndex The index to move from
   * @param toIndex The index to move to
   * @param finish Optional: Function to execute once the response has been received
   */
  performBitstreamMoveRequest(bundle: Bundle, fromIndex: number, toIndex: number, finish?: () => void) {
    if (this.getPerformingMoveRequest()) {
      console.warn('Attempted to perform move request while previous request has not completed yet');
      return;
    }

    const moveOperation: MoveOperation = {
      op: 'move',
      from: `/_links/bitstreams/${fromIndex}/href`,
      path: `/_links/bitstreams/${toIndex}/href`,
    };

    this.announceLoading();
    this.isPerformingMoveRequest.next(true);
    this.bundleService.patch(bundle, [moveOperation]).pipe(
      getFirstCompletedRemoteData(),
      tap((response: RemoteData<Bundle>) => this.displayFailedResponseNotifications(MOVE_KEY, [response])),
      switchMap(() => this.requestService.setStaleByHrefSubstring(bundle.self)),
      take(1),
    ).subscribe(() => {
      this.isPerformingMoveRequest.next(false);
      finish?.();
    });
  }

  /**
   * Whether the service currently is processing a 'move' request
   */
  getPerformingMoveRequest(): boolean {
    return this.isPerformingMoveRequest.value;
  }

  /**
   * Returns an observable which emits when the service starts, or ends, processing a 'move' request
   */
  getPerformingMoveRequest$(): Observable<boolean> {
    return this.isPerformingMoveRequest;
  }

  /**
   * Returns the pagination options to use when fetching the bundles
   */
  getInitialBundlesPaginationOptions(): PaginationComponentOptions {
    return Object.assign(new PaginationComponentOptions(), {
      id: 'bundles-pagination-options',
      currentPage: 1,
      pageSize: 9999,
    });
  }

  /**
   * Returns the initial pagination options to use when fetching the bitstreams
   * @param bundleName The name of the bundle, will be as pagination id.
   */
  getInitialBitstreamsPaginationOptions(bundleName: string): PaginationComponentOptions {
    return Object.assign(new PaginationComponentOptions(),{
      id: bundleName, // This might behave unexpectedly if the item contains two bundles with the same name
      currentPage: 1,
      pageSize: 10,
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
      new ResponsiveColumnSizes(6, 5, 4, 3, 3),
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
    this.displayFailedResponseNotifications(key, responses);
    this.displaySuccessFulResponseNotifications(key, responses);
  }

  /**
   * Display an error notification for each failed response with their message
   * @param key       The i18n key for the notification messages
   * @param responses The returned responses to display notifications for
   */
  displayFailedResponseNotifications(key: string, responses: RemoteData<any>[]) {
    const failedResponses = responses.filter((response: RemoteData<Bundle>) => hasValue(response) && response.hasFailed);
    failedResponses.forEach((response: RemoteData<Bundle>) => {
      this.displayErrorNotification(key, response.errorMessage);
    });
  }

  /**
   * Display an error notification with the provided key and message
   * @param key          The i18n key for the notification messages
   * @param errorMessage The error message to display
   */
  displayErrorNotification(key: string, errorMessage: string) {
    this.notificationsService.error(this.translateService.instant(`${key}.failed.title`), errorMessage);
  }

  /**
   * Display a success notification in case there's at least one successful response
   * @param key       The i18n key for the notification messages
   * @param responses The returned responses to display notifications for
   */
  displaySuccessFulResponseNotifications(key: string, responses: RemoteData<any>[]) {
    const successfulResponses = responses.filter((response: RemoteData<Bundle>) => hasValue(response) && response.hasSucceeded);
    if (successfulResponses.length > 0) {
      this.displaySuccessNotification(key);
    }
  }

  /**
   * Display a success notification with the provided key
   * @param key          The i18n key for the notification messages
   */
  displaySuccessNotification(key: string) {
    this.notificationsService.success(this.translateService.instant(`${key}.saved.title`), this.translateService.instant(`${key}.saved.content`));
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
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.getFieldUpdates(bundle.self, [], true)),
      )),
      map((fieldUpdates: FieldUpdates[]) => ([] as FieldUpdate[]).concat(
        ...fieldUpdates.map((updates: FieldUpdates) => Object.values(updates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE)),
      )),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field)),
    );

    // Send out delete requests for all deleted bitstreams
    return removedBitstreams$.pipe(
      take(1),
      switchMap((removedBitstreams: Bitstream[]) => {
        return this.bitstreamService.removeMultiple(removedBitstreams);
      }),
    );
  }

  /**
   * Creates an array of {@link BitstreamTableEntry}s from an array of {@link Bitstream}s
   * @param bitstreams The bitstreams array to map to table entries
   */
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
    // ID can not contain spaces itself.
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

  /**
   * Adds a message to the live region mentioning that the bitstream with the provided name was selected.
   * @param bitstreamName The name of the bitstream that was selected.
   */
  announceSelect(bitstreamName: string) {
    const message = this.translateService.instant('item.edit.bitstreams.edit.live.select',
      { bitstream: bitstreamName });
    this.liveRegionService.addMessage(message);
  }

  /**
   * Adds a message to the live region mentioning that the bitstream with the provided name was moved to the provided
   * position.
   * @param bitstreamName The name of the bitstream that moved.
   * @param toPosition The zero-indexed position that the bitstream moved to.
   */
  announceMove(bitstreamName: string, toPosition: number) {
    const message = this.translateService.instant('item.edit.bitstreams.edit.live.move',
      { bitstream: bitstreamName, toIndex: toPosition + 1 });
    this.liveRegionService.addMessage(message);
  }

  /**
   * Adds a message to the live region mentioning that the bitstream with the provided name is no longer selected and
   * was returned to the provided position.
   * @param bitstreamName The name of the bitstream that is no longer selected
   * @param toPosition The zero-indexed position the bitstream returned to.
   */
  announceCancel(bitstreamName: string, toPosition: number) {
    const message = this.translateService.instant('item.edit.bitstreams.edit.live.cancel',
      { bitstream: bitstreamName, toIndex: toPosition + 1 });
    this.liveRegionService.addMessage(message);
  }

  /**
   * Adds a message to the live region mentioning that the bitstream with the provided name is no longer selected.
   * @param bitstreamName The name of the bitstream that is no longer selected.
   */
  announceClear(bitstreamName: string) {
    const message = this.translateService.instant('item.edit.bitstreams.edit.live.clear',
      { bitstream: bitstreamName });
    this.liveRegionService.addMessage(message);
  }

  /**
   * Adds a message to the live region mentioning that the
   */
  announceLoading() {
    const message = this.translateService.instant('item.edit.bitstreams.edit.live.loading');
    this.liveRegionService.addMessage(message);
  }
}
