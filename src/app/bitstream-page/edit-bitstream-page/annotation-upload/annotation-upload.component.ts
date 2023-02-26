import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, Input,
  OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {
  getFirstSucceededRemoteDataPayload
} from '../../../core/shared/operators';
import { Bundle } from '../../../core/shared/bundle.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { UploaderOptions } from '../../../shared/upload/uploader/uploader-options.model';
import { UploaderComponent } from '../../../shared/upload/uploader/uploader.component';
import { AuthService } from '../../../core/auth/auth.service';
import { RequestService } from '../../../core/data/request.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { Observable, of as observableOf, Subscription, zip as observableZip } from 'rxjs';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import { environment } from '../../../../environments/environment';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { XSRF_REQUEST_HEADER } from '../../../core/xsrf/xsrf.interceptor';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { BUNDLE_NAME } from '../annotation/annotation.component';

/**
 * Component for adding and removing IIIF annotation files.
 */
@Component({
  selector: 'ds-iiif-annotation-upload',
  styleUrls: ['./annotation-upload.component.scss'],
  templateUrl: './annotation-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationUploadComponent implements OnInit, OnDestroy {

  /**
   * The file uploader component
   */
  @ViewChild(UploaderComponent) uploaderComponent: UploaderComponent;

  /**
   * Used to reinitialize both the parent component and this component on file changes.
   */
  @Output() changeStatusEvent = new EventEmitter<any>();

  /**
   * Used to reinitialize both the parent component and this component on file changes.
   */
  @Output() closeDialog = new EventEmitter<any>();

  /**
   * Parent item of the current bitstream.
   */
  @Input() item: Item;

  /**
   * Bundle of the current bitstream.
   */
  @Input() annotationBundle: Bundle;

  /**
   * The annotation bitstream file.
   */
  @Input() annotationFile: Bitstream;

  /**
   * The dc.title of the annotation file.
   */
  @Input() annotationFileTitle: string;

  /**
   * The content href of the annotation file to use when downloading.
   */
  bitstreamDownload: string;

  /**
   * Used to show or hide the ds-uploader component.
   */
  showUploaderComponent = true;

  /**
   * Sets the view to highlight deletion
   */
  activeDeleteStatus = false;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  /**
   * Observable of the item's bundles.
   */
  bundles$: Observable<PaginatedList<Bundle>>;

  discardTimeOut = environment.item.edit.undoTimeout;

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
   * The prefix for all i18n notification messages within this component
   */
  NOTIFICATIONS_PREFIX = 'iiif.image.annotation.notifications.';

  constructor(private itemService: ItemDataService,
              private route: ActivatedRoute,
              private bundleService: BundleDataService,
              protected authService: AuthService,
              protected router: Router,
              protected requestService: RequestService,
              protected translate: TranslateService,

              protected bitstreamService: BitstreamDataService,

              protected changeDetector: ChangeDetectorRef,
              protected objectCacheService: ObjectCacheService,

              protected notificationsService: NotificationsService,
              private objectUpdatesService: ObjectUpdatesService,
              private translateService: TranslateService,
              private tokenExtractor: HttpXsrfTokenExtractor ) {}

  ngOnInit(): void {
    if (this.annotationBundle) {
      this.setUploadUrl(this.annotationBundle);
      if (this.annotationFile) {
        this.bitstreamDownload = this.annotationFile._links.content.href;
        this.showUploaderComponent = false;
        this.activeDeleteStatus = false;
        this.changeDetector.detectChanges();
      }
    } else {
      this.createAnnotationBundle(this.item);
    }
  }

  /**
   * Creates the annotation bundle for the item.
   * @param item
   */
  createAnnotationBundle(item: Item) {
    this.subs.push(this.itemService.createBundle(item.id, BUNDLE_NAME).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((bundle: Bundle) => {
      this.annotationBundle = bundle;
      // update the headers in 'ds-uploader' with new tokens
      this.updateTokens();
      this.setUploadUrl(bundle);
    }));
  }

  /**
   * Set the href in uploader options and re-initialize the uploader component.
   */
  setUploadUrl(bundle: Bundle) {
    this.subs.push(this.bundleService.getBitstreamsEndpoint(bundle.id).pipe(take(1)).subscribe((href: string) => {
      this.uploadFilesOptions.url = href;
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }
      // Re-initialize the uploader component to ensure the latest changes to the options are applied
      if (this.uploaderComponent) {
        this.updateTokens();
        this.uploaderComponent.ngOnInit();
        this.uploaderComponent.ngAfterViewInit();
      }
    }));
  }

  /**
   * Called after successful upload.
   * @param bitstream
   */
  public onCompleteItem(bitstream: Bitstream) {
    bitstream.metadata['dc.title'][0].value = this.annotationFileTitle;
    this.subs.push(this.bitstreamService.update(bitstream).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe(() => {
      this.changeStatusEvent.emit([bitstream, this.annotationBundle]);
      this.bitstreamService.commitUpdates();
      this.annotationFile = bitstream;
      this.bitstreamDownload = bitstream._links.content.href;
      this.showUploaderComponent = false;
      this.activeDeleteStatus = false;
      this.changeDetector.detectChanges();
      this.notificationsService.success(
        this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'added.title'),
        this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'added.content'),
        {timeOut: this.discardTimeOut});
      this.bundleService.getBitstreamsEndpoint(this.annotationBundle.id).pipe(take(1)).subscribe((href: string) => {
        this.requestService.setStaleByHrefSubstring(href);
      });
    }));

  }

  /**
   * The request was unsuccessful, display an error notification
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get(this.NOTIFICATIONS_PREFIX + 'upload.failed'));
  }

  /**
   * This function is called when the annotation file deletion is confirmed by user.
   */
  saveChange(): void {
    const removedBitstreams$ = this.objectUpdatesService.getFieldUpdates(this.annotationBundle.self, [], true).pipe(
      map((fieldUpdates: FieldUpdates) => {
          return Object.values(fieldUpdates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE);
      }),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field))
    );
    // Send out delete requests for all deleted bitstreams
    const removedResponses$ = removedBitstreams$.pipe(
      take(1),
      switchMap((removedBitstreams: Bitstream[]) => {
        if (isNotEmpty(removedBitstreams)) {
          return observableZip(...removedBitstreams.map((bitstream: Bitstream) => this.bitstreamService.delete(bitstream.id)));
        } else {
          return observableOf(undefined);
        }
      })
    );
    this.subs.push(removedResponses$.pipe(take(1)).subscribe((responses: RemoteData<NoContent>[]) => {
      if (hasValue(responses)) {
        this.changeStatusEvent.emit([undefined, this.annotationBundle]);
        this.showUploaderComponent = true;
        this.changeDetector.detectChanges();
        this.updateTokens();
        this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.title');
        this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.content');
        this.notificationsService.success(
          this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.title'),
          this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.content'),
          {timeOut: this.discardTimeOut});
      }
    }));
  }

  /**
   * Updates the 'ds-uploader' headers with the current CSRF and authorization tokens.
   */
  updateTokens(): void {
    // bundle is now created so set the uploader url headers
    this.uploaderComponent.uploader.options.headers = [
      {name: 'authorization', value: this.authService.buildAuthHeader()},
      { name: XSRF_REQUEST_HEADER, value: this.tokenExtractor.getToken() }
    ];
  }

  /**
   * Adds a "remove" field update for the bitstream. The bitstream will be removed
   * when the deletion is confirmed.
   */
  remove(): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.annotationBundle._links.self.href, this.annotationFile);
    this.activeDeleteStatus = true;
    this.changeDetector.detectChanges();
  }

  /**
   * Cancel the deletion update.
   */
  onCancel() {
    this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'cancel.title');
    this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'cancel.content');
    const undoNotification = this.notificationsService.success(null,
      this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'cancel.content'),
      {timeOut: this.discardTimeOut});
    this.objectUpdatesService.discardAllFieldUpdates(this.annotationBundle._links.self.href, undoNotification);
    this.activeDeleteStatus = false;
    this.changeDetector.detectChanges();
  }

  closeView(): void {
    this.closeDialog.emit();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
