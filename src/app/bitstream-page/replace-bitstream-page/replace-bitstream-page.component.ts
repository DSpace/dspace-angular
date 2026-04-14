import {
  AsyncPipe,
  Location,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { RestRequestMethod } from '@dspace/config/rest-request-method';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { getBitstreamModuleRoute } from '@dspace/core/router/core-routing-paths';
import { Bundle } from '@dspace/core/shared/bundle.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  hasValue,
  isEmpty,
} from '@dspace/shared/utils/empty.util';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { RemoteData } from '../../core/data/remote-data';
import { RequestService } from '../../core/data/request.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../shared/upload/uploader/uploader-options.model';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';

@Component({
  selector: 'ds-replace-bitstream-page',
  templateUrl: './replace-bitstream-page.component.html',
  styleUrls: ['./replace-bitstream-page.component.scss'],
  imports: [
    AsyncPipe,
    ErrorComponent,
    FileSizePipe,
    FileUploadModule,
    NgClass,
    ThemedLoadingComponent,
    TranslatePipe,
    UiSwitchModule,
    UploaderComponent,
  ],
})
/**
 * Page component that allows a privileged user to replace the content of an existing Bitstream.
 *
 * The component is reached via the Bitstream admin "Edit" page and is protected by
 * {@link replaceBitstreamPageGuard}, which verifies that the current user holds the
 * {@link FeatureID.CanReplaceBitstream} authorization feature for this Bitstream.
 *
 * On save the component issues a `PUT` request to `bitstreams/{uuid}/content`, which is the
 * standard DSpace REST endpoint for replacing Bitstream file content.  On success the Bitstream
 * and its parent Bundle are marked stale in the request cache so that any downstream views
 * immediately reflect the new file, and the user is redirected back to the Bitstream edit page.
 */
export class ReplaceBitstreamPageComponent implements OnInit {
  saveNotificationKey = 'bitstream.replace.page.upload.success';
  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    // URL needs to contain something to not produce any errors. This will be replaced once a bundle has been selected.
    url: 'placeholder', /* TODO Change upload URL */
    authToken: null,
    disableMultipart: false,
    itemAlias: null,
    autoUpload: false,
    method: RestRequestMethod.PUT,
  });

  /**
   * Upload url without parameters
   */
  private uploadFilesUrlNoParam: string;

  /**
   * The bitstream's remote data observable
   * Tracks changes and updates the view
   */
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Whether to keep the file name of the new uploaded file
   */
  protected shouldReplaceName = true;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationsService,
    private location: Location,
    private translateService: TranslateService,
    private authService: AuthService,
    private requestService: RequestService,
    private router: Router,
    private linkService: LinkService,
  ) {
  }

  ngOnInit(): void {
    this.bitstreamRD$ = this.route.data.pipe(map((data) => data.bitstream));
    this.setUploadUrl();
  }

  back() {
    this.location.back();
  }

  save(uploader: UploaderComponent) {
    this.setUploadUrlParameters(uploader);
    uploader.uploader.uploadAll();
  }

  /**
   * The request was successful, redirect the user
   * @param bitstream
   */
  public onCompleteItem(bitstream: Bitstream) {
    this.invalidate(bitstream);
    this.notificationService.success(this.translateService.instant(this.saveNotificationKey));
    this.router.navigate([getBitstreamModuleRoute(), bitstream.id, 'edit'], {
      replaceUrl: true,
    });
  }

  /**
   * The request was unsuccessful, display an error notification
   */
  public onUploadError() {
    this.notificationService.error(null, this.translateService.get('bitstream.replace.page.upload.failed'));
  }

  /**
   * Set the replace url to match the selected bitstream ID
   */
  setUploadUrl() {
    this.bitstreamRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((bitstream) => bitstream._links.self.href),
    ).subscribe((href: string) => {
      this.uploadFilesUrlNoParam = href;
      this.setUploadUrlParameters();
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }
    });
  }

  /**
   * Invalidate the old Bitstream that has been replaced (and thus deleted), as well as our owning Bundle and Item
   */
  private invalidate(newBitstream: Bitstream) {
    console.log(newBitstream); // todo: remove this
    // the Bitstream returned after upload is not an instance of Bitstream yet
    newBitstream = Object.assign(new Bitstream(), newBitstream)
    this.linkService.resolveLink<Bitstream>(newBitstream, followLink('bundle'));
    this.requestService.setStaleByHrefSubstring(newBitstream.firstMetadata('dspace.bitstream.isReplacementOf')?.authority);

    newBitstream.bundle.pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((bundle: Bundle) => {
        this.requestService.setStaleByHrefSubstring(bundle.self);
        this.linkService.resolveLink<Bundle>(bundle, followLink('item'));
        return bundle.item;
      }),
      getFirstSucceededRemoteDataPayload(),
    ).subscribe((item: Item) => {
      this.requestService.setStaleByHrefSubstring(item.self);
    });
  }

  protected setUploadUrlParameters(uploader?: UploaderComponent) {
    this.uploadFilesOptions.url = new URLCombiner(this.uploadFilesUrlNoParam, `/content?replaceName=${this.shouldReplaceName}`).toString();
    if (hasValue(uploader?.uploader?.options)) {
      uploader.uploader.options.url = this.uploadFilesOptions.url;
    }
  }

}
