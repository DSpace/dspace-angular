import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UploaderOptions } from '../../../shared/uploader/uploader-options.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { hasValue, hasValueOperator } from '../../../shared/empty.util';
import { ItemDataService } from '../../../core/data/item-data.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { UploaderProperties } from '../../../shared/uploader/uploader-properties.model';
import { getBitstreamModulePath } from '../../../app-routing.module';

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
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = {
    url: '',
    authToken: null,
    disableMultipart: false,
    itemAlias: null
  };

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  subs: Subscription[] = [];

  /**
   * Properties to send with the upload request
   */
  uploadProperties = Object.assign(new UploaderProperties(), {
    bundleName: 'ORIGINAL'
  });

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected itemService: ItemDataService,
              protected authService: AuthService,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(map((data) => data.item));
    this.subs.push(
      this.route.queryParams.pipe(
        map((params) => params.bundleName),
        hasValueOperator(),
        distinctUntilChanged()
      ).subscribe((bundleName: string) => {
        this.uploadProperties.bundleName = bundleName;
      })
    );
    this.subs.push(
      this.itemRD$.pipe(
        map((itemRD: RemoteData<Item>) => itemRD.payload),
        switchMap((item: Item) => this.itemService.getBitstreamsEndpoint(item.id)),
        distinctUntilChanged()
      ).subscribe((url: string) => {
        this.uploadFilesOptions.url = url;
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      })
    );
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
   * Unsubscribe from all open subscriptions when the component is destroyed
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
