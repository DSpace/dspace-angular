import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
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
import {
  checkForExistingAnnotation,
  getAnnotationFileName,
  getItem,
  getItemBundles
} from '../annotation/utils/annotationUtils';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';

/**
 * Component for adding and removing IIIF annotation files.
 */
@Component({
  selector: 'ds-iiif-annotation-upload',
  styleUrls: ['./annotation-upload.component.scss'],
  templateUrl: './annotation-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationUploadComponent implements AfterViewInit, OnDestroy {

  /**
   * The bundle containing annotation files
   */
  BUNDLE_NAME = 'ANNOTATIONS';

  /**
   * The file uploader component
   */
  @ViewChild(UploaderComponent) uploaderComponent: UploaderComponent;

  /**
   * The dc.title for the new annotation file.
   */
  annotationFileTitle: string;

  /**
   * The annotations bundle dso
   */
  annotationBundle: Bundle;

  bitstreamDownload: string;

  /**
   * Used to show or hide the ds-uploader component.
   */
  showUploaderComponent = true;

  /**
   * The annotation bitstream dso.
   */
  annotationBitstream: Bitstream;

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
  NOTIFICATIONS_PREFIX = 'item.bitstreams.upload.notifications.';

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

  ngAfterViewInit(): void {
    // get bitstream from the route.
    const bitstreamRD$ = this.route.data.pipe(map((data) =>  {
      this.annotationFileTitle = getAnnotationFileName(data.bitstream.payload.id);
      return data.bitstream;
    }));
    // get the item and paginated bundles
    const item$ = getItem(bitstreamRD$);
    this.bundles$ = getItemBundles(item$);
    this.subs.push(this.bundles$.pipe(
    ).subscribe((bundles: PaginatedList<Bundle>) => {
      this.checkForExistingAnnotationBundle(bundles, item$);
    }));
  }

  /**
   * Looks for an existing annotations bundle.If the annotations bundle exists, calls
   * a function  to check for a matching file in the annotations bundle and updates
   * the view. Otherwise, create the missing bundle.
   * @param bundles
   * @param item
   */
  checkForExistingAnnotationBundle(bundles: PaginatedList<Bundle>, item: Observable<Item>): void {
    const annotBundle = bundles.page.filter((bundle: Bundle) => bundle.name === this.BUNDLE_NAME)
      .map((bundle: Bundle) => {
        this.annotationBundle = bundle;
        this.setUploadUrl(bundle);
        this.checkForExistingAnnotationFile(bundle);
      });

    if (annotBundle.length === 0) {
      this.subs.push(item.subscribe((item: Item) => this.createAnnotationBundle(item)));
    }
}

  /**
   * Checks for matching file in the annotations bundle. If found,
   * hides the 'ds-uploader' and shows the bitstream.
   * @param annotationsBundle bundle
   */
  checkForExistingAnnotationFile(annotationsBundle: Bundle) {
    this.subs.push(checkForExistingAnnotation(annotationsBundle, this.annotationFileTitle)
      .subscribe((bitstream: Bitstream) => {
        this.annotationBitstream = bitstream;
        this.bitstreamDownload = bitstream._links.content.href;
        // A matching bitstream exists. Hide the uploader.
        this.showUploaderComponent = false;
        this.changeDetector.detectChanges();
      })
    );
  }

  /**
   * Creates the annotation bundle for the item.
   * @param item
   */
  createAnnotationBundle(item: Item) {
    this.subs.push(this.itemService.createBundle(item.id, this.BUNDLE_NAME).pipe(
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
      this.bitstreamService.commitUpdates();
      this.annotationBitstream = bitstream;
      this.showUploaderComponent = false;
      this.activeDeleteStatus = false;
      this.changeDetector.detectChanges();
      this.notificationsService.success('file added', 'added file', {timeOut: this.discardTimeOut})
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
    const removedBitstreams$ = this.bundles$.pipe(
      map((bundleList: PaginatedList<Bundle>) => bundleList.page),
      switchMap((bundles: Bundle[]) => observableZip(
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.getFieldUpdates(bundle.self, [], true))
      )),
      map((fieldUpdates: FieldUpdates[]) => {
        return ([] as FieldUpdate[]).concat(
          ...fieldUpdates.map((updates: FieldUpdates) => Object.values(updates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE))
        )
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
        this.showUploaderComponent = true;
        this.changeDetector.detectChanges();
        this.updateTokens();
        this.notificationsService.success('file deleted', 'removed file', {timeOut: this.discardTimeOut});
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
    this.objectUpdatesService.saveRemoveFieldUpdate(this.annotationBundle._links.self.href, this.annotationBitstream);
    this.activeDeleteStatus = true;
    this.changeDetector.detectChanges();
  }

  /**
   * Cancel the deletion update.
   */
  onCancel() {
    // this.translateService.instant(this.notificationsPrefix + key + '.title');
    // this.translateService.instant(this.notificationsPrefix + key + '.content');
    const undoNotification = this.notificationsService.info('discard change', 'removed discard', {timeOut: this.discardTimeOut});
    this.objectUpdatesService.discardAllFieldUpdates(this.annotationBundle._links.self.href, undoNotification);
    this.activeDeleteStatus = false;
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
