import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { map, switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UploaderOptions } from '../../../shared/uploader/uploader-options.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { hasValue, isEmpty } from '../../../shared/empty.util';
import { ItemDataService } from '../../../core/data/item-data.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { getBitstreamModulePath } from '../../../app-routing.module';
import { PaginatedList } from '../../../core/data/paginated-list';
import { Bundle } from '../../../core/shared/bundle.model';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { getRemoteDataPayload, getSucceededRemoteData } from '../../../core/shared/operators';

@Component({
  selector: 'ds-upload-bitstream',
  templateUrl: './upload-bitstream.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Page component for uploading a bitstream to an item
 */
export class UploadBitstreamComponent implements OnInit, OnDestroy {

  /**
   * The item to upload a bitstream to
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The item's bundles
   */
  bundlesRD$: Observable<RemoteData<PaginatedList<Bundle>>>;

  /**
   * The ID of the currently selected bundle to upload a bitstream to
   */
  selectedBundleId: string;

  /**
   * The name of the currently selected bundle to upload a bitstream to
   */
  selectedBundleName: string;

  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    // URL needs to contain something to not produce any errors. This will be replaced once a bundle has been selected.
    url: 'placeholder',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  });

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  subs: Subscription[] = [];

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected itemService: ItemDataService,
              protected bundleService: BundleDataService,
              protected authService: AuthService,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService) {
  }

  /**
   * Initialize component properties:
   * itemRD$          Fetched from the current route data (populated by BitstreamPageResolver)
   * bundlesRD$       List of bundles on the item
   * selectedBundleId Starts off by checking if the route's queryParams contain a "bundle" parameter. If none is found,
   *                  the ID of the first bundle in the list is selected.
   * Calls setUploadUrl after setting the selected bundle
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.bundlesRD$ = this.itemRD$.pipe(
      switchMap((itemRD: RemoteData<Item>) => itemRD.payload.bundles)
    );
    this.selectedBundleId = this.route.snapshot.queryParams.bundle;
    if (isEmpty(this.selectedBundleId)) {
      this.bundlesRD$.pipe(
        getSucceededRemoteData(),
        getRemoteDataPayload(),
        take(1)
      ).subscribe((bundles: PaginatedList<Bundle>) => {
        if (bundles.page.length > 0) {
          this.selectedBundleId = bundles.page[0].id;
          this.setUploadUrl();
        }
      });
    } else {
      this.setUploadUrl();
    }
  }

  /**
   * Set the upload url to match the selected bundle ID
   */
  setUploadUrl() {
    this.bundleService.getBitstreamsEndpoint(this.selectedBundleId).pipe(take(1)).subscribe((href: string) => {
      this.uploadFilesOptions.url = href;
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }
    });
  }

  /**
   * The request was successful, redirect the user to the new bitstream's edit page
   * @param bitstream
   */
  public onCompleteItem(bitstream) {
    this.router.navigate([getBitstreamModulePath(), bitstream.id, 'edit']);
  }

  /**
   * The request was unsuccessful, display an error notification
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get('item.bitstreams.upload.failed'));
  }

  /**
   * The user selected a bundle from the input suggestions
   * Set the bundle ID and Name properties, as well as the upload URL
   * @param bundle
   */
  onClick(bundle: Bundle) {
    this.selectedBundleId = bundle.id;
    this.selectedBundleName = bundle.name;
    this.setUploadUrl();
  }

  /**
   * @returns {string} the current URL
   */
  getCurrentUrl() {
    return this.router.url;
  }

  /**
   * Unsubscribe from all open subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
