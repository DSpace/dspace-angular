import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { RemoteData } from '@dspace/core/data/remote-data';
import { VersionHistoryDataService } from '@dspace/core/data/version-history-data.service';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { Item } from '@dspace/core/shared/item.model';
import {
  getAllSucceededRemoteData,
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { Version } from '@dspace/core/shared/version.model';
import { VersionHistory } from '@dspace/core/shared/version-history.model';
import {
  hasValue,
  hasValueOperator,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  EMPTY,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';

@Component({
  selector: 'ds-item-versions-notice',
  templateUrl: './item-versions-notice.component.html',
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    TranslateModule,
  ],
})
/**
 * Component for displaying a warning notice when the item is not the latest version within its version history
 * The notice contains a link to the latest version's item page
 */
export class ItemVersionsNoticeComponent implements OnInit {
  /**
   * The item to display a version notice for
   */
  @Input() item: Item;

  /**
   * The item's version
   */
  versionRD$: Observable<RemoteData<Version>>;

  /**
   * The item's full version history
   */
  versionHistoryRD$: Observable<RemoteData<VersionHistory>>;

  /**
   * The latest version of the item's version history
   */
  latestVersion$: Observable<Version>;

  /**
   * Is the item's version equal to the latest version from the version history?
   * This will determine whether or not to display a notice linking to the latest version
   */
  showLatestVersionNotice$: Observable<boolean>;

  /**
   * Pagination options to fetch a single version on the first page (this is the latest version in the history)
   */

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

  constructor(private versionHistoryService: VersionHistoryDataService) {
  }

  /**
   * Initialize the component's observables
   */
  ngOnInit(): void {
    if (hasValue(this.item.version)) {
      this.versionRD$ = this.item.version;
      this.versionHistoryRD$ = this.versionRD$.pipe(
        getAllSucceededRemoteData(),
        getRemoteDataPayload(),
        hasValueOperator(),
        switchMap((version: Version) => version.versionhistory),
      );

      this.latestVersion$ = this.versionHistoryRD$.pipe(
        getFirstCompletedRemoteData(),
        switchMap((vhRD: RemoteData<VersionHistory>) => {
          if (vhRD.hasSucceeded) {
            return this.versionHistoryService.getLatestVersionFromHistory$(vhRD.payload);
          } else {
            return EMPTY;
          }
        }),
      );

      this.showLatestVersionNotice$ = this.versionRD$.pipe(
        getFirstCompletedRemoteData(),
        switchMap((versionRD: RemoteData<Version>) => {
          if (versionRD.hasSucceeded) {
            return this.versionHistoryService.isLatest$(versionRD.payload).pipe(
              map((isLatest) => isLatest != null && !isLatest),
            );
          } else {
            return of(false);
          }
        }),
        startWith(false),
      );
    }
  }

  /**
   * Get the item page url
   * @param item The item for which the url is requested
   */
  getItemPage(item: Item): string {
    if (hasValue(item)) {
      return getItemPageRoute(item);
    }
  }
}
