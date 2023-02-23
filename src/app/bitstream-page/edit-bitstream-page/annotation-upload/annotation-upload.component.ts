import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  getFirstCompletedRemoteData, getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { Bundle } from '../../../core/shared/bundle.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { expand, filter, map, switchMap, take } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { hasNoValue, hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
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
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { XSRF_REQUEST_HEADER } from '../../../core/xsrf/xsrf.interceptor';

@Component({
  selector: 'ds-iiif-annotation-upload',
  styleUrls: ['./annotation-upload.component.scss'],
  templateUrl: './annotation-upload.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export class AnnotationUploadComponent implements AfterViewInit, OnDestroy {

  BUNDLE_NAME = 'ANNOTATIONS';

  BITSTREAM_LINKS_TO_FOLLOW: FollowLinkConfig<Bitstream>[] = [
    followLink('bundle', {},
      followLink('item', {},
        followLink('bundles', {},
          followLink('bitstreams'))))
  ];

  /**
   * The file uploader component
   */
  @ViewChild(UploaderComponent) uploaderComponent: UploaderComponent;

  @Input() itemId: string;

  /**
   * The dc.title for the new annotation file.
   */
  annotationFileTitle: string;

  @Input() bitstreamId: string;

  annotationBundle: Bundle;

  showUploader = true;

  annotationBitstream: Bitstream;

  annotationFileName: string;

  itemDSO: Item;

  showSave;

  activeStatus = false;

  discardTimeOut = environment.item.edit.undoTimeout;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

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

              protected notificationsService: NotificationsService,
              private objectUpdatesService: ObjectUpdatesService,

              private translateService: TranslateService,
              private tokenExtractor: HttpXsrfTokenExtractor ) {}


  ngAfterViewInit(): void {
    const bitstreamRD$ = this.route.data.pipe(map((data) =>  {
      this.annotationFileTitle = data.bitstream.payload.id + '.json';
      return data.bitstream;
    }));

    const itemRD$ = bitstreamRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((bitstream: Bitstream) => bitstream.bundle.pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        switchMap((bundle: Bundle) => bundle.item.pipe(
          getFirstCompletedRemoteData()))))
    );

    const bundlesRD$ = itemRD$.pipe(
      switchMap((item: RemoteData<Item>) => {
        this.itemDSO = item.payload;
        return item.payload.bundles;
      })
    );
    this.subs.push(bundlesRD$.pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((bundles: RemoteData<PaginatedList<Bundle>>) => {
      if (hasNoValue(this.annotationBundle)) {
        this.checkForExistingAnnotationBundle(bundles.payload, this.itemDSO);
      }
    }));
    this.changeDetector.detectChanges();
  }

  /**
   * Looks for an existing annotations bundle. Creates the bundle if
   * it does not exist already. If the annotations bundle exists, calls
   * a function  to check for an existing file in the annotations bundle.
   * @param bundles
   * @param item
   */
  checkForExistingAnnotationBundle(bundles: PaginatedList<Bundle>, item: Item): void {
    const matchingBundle = bundles.page.find((bundle: Bundle) =>
      bundle.name === this.BUNDLE_NAME);
    if (hasValue(matchingBundle)) {
      // use the existing bundle
      this.annotationBundle = matchingBundle;
      this.setUploadUrl();
      // now check for files in the annotations bundle
      this.checkForExistingAnnotationFile(matchingBundle);
    } else if (hasNoValue(this.annotationBundle)) {
      // create the annotations bundle
      this.createAnnotationBundle(item);
    }

  }

  /**
   * Checks for matching file in the existing annotations bundle. If found,
   * hides the uploader component and sets the annotation file name and bitstream
   * dso to the found object.
   * @param annotationsBundle bundle
   */
  checkForExistingAnnotationFile(annotationsBundle: Bundle) {

    this.subs.push(annotationsBundle.bitstreams.pipe(
      getFirstCompletedRemoteData())
      .subscribe((bitstreams: RemoteData<PaginatedList<Bitstream>>) => {
        // If there are no files in the bundle show the uploader.
        if (bitstreams.payload.pageInfo.totalElements === 0) {
          this.showUploader = true;
        } else {
          this.checkForExistingAnnotation(annotationsBundle)
            .subscribe((bitstream: Bitstream) => {
              this.annotationFileName = bitstream.metadata['dc.title'][0].value;
              this.annotationBitstream = bitstream;
              this.showUploader = false;
              // this.setUploadUrl();
              this.changeDetector.detectChanges();
            });
        }

      }));
  }

  checkForExistingAnnotation(bundle: Bundle): Observable<Bitstream> {
    return bundle.bitstreams.pipe(
      getFirstCompletedRemoteData(),
    getRemoteDataPayload(),
    expand((paginatedList: PaginatedList<Bitstream>) => {
        if (hasNoValue(paginatedList.next)) {
          // If there's no next page, stop.
          return EMPTY;
        } else {
          // Otherwise retrieve the next page
          return this.bitstreamService.findListByHref(
            paginatedList.next,
            {},
            true,
            true,
          ).pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload(),
            map((next: PaginatedList<Bitstream>) => {
              if (hasValue(next)) {
                return next;
              } else {
                return EMPTY;
              }
            })
          )
        }
      }),
      switchMap((paginatedList: PaginatedList<Bitstream>) => {
        if (hasValue(paginatedList.page)) {
          return paginatedList.page;
        }
      }),
      //tap((bitstream: Bitstream) => console.log(bitstream)),
      filter((bitstream: Bitstream) => bitstream.metadata['dc.title'][0].value === this.annotationFileTitle),
      //tap((bitstream: Bitstream) => console.log('found bitstream in annotation bundle')),
      take(1)
    );
  }

  createAnnotationBundle(item: Item) {

    this.subs.push(this.itemService.createBundle(item.id, this.BUNDLE_NAME).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((bundle: Bundle) => {
      this.annotationBundle = bundle;
      // bundle is now created so set the uploader url headers
      this.uploaderComponent.uploader.options.headers = [
        {name: 'authorization', value: this.authService.buildAuthHeader()},
        { name: XSRF_REQUEST_HEADER, value: this.tokenExtractor.getToken() }
      ];
      this.setUploadUrl();
    }));
  }


  /**
   * Set the upload url to match the selected bundle ID
   */
  setUploadUrl() {

    this.subs.push(this.bundleService.getBitstreamsEndpoint(this.annotationBundle.id).pipe(take(1)).subscribe((href: string) => {
      this.uploadFilesOptions.url = href;
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }

      // Re-initialize the uploader component to ensure the latest changes to the options are applied
      if (this.uploaderComponent) {
        this.uploaderComponent.ngOnInit();
        this.uploaderComponent.ngAfterViewInit();
      }
    }));
  }

  /**
   * The request was successful, update the page.
   * @param bitstream
   */
  public onCompleteItem(bitstream: Bitstream) {
    bitstream.metadata['dc.title'][0].value = this.annotationFileTitle;
    this.subs.push(this.bitstreamService.update(bitstream).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.annotationBitstream = bitstream;
      this.annotationFileName = bitstream.metadata['dc.title'][0].value;
      this.showSave = false;
      this.showUploader = false;
      this.changeDetector.detectChanges();
    }));
    // assures that the annotations file list is updated in edit item view
    this.bundleService.getBitstreamsEndpoint(this.annotationBundle.id).pipe(take(1)).subscribe((href: string) => {
      this.requestService.removeByHrefSubstring(href);
    });
  }

  /**
   * The request was unsuccessful, display an error notification
   */
  public onUploadError() {
    this.notificationsService.error(null, this.translate.get(this.NOTIFICATIONS_PREFIX + 'upload.failed'));
  }

  saveChange(): void {
    const removedBitstreams$ = this.itemDSO.bundles.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((bundleList: PaginatedList<Bundle>) => {
        return bundleList.page;
      }),
      switchMap((bundles: Bundle[]) => observableZip(
        ...bundles.map((bundle: Bundle) => this.objectUpdatesService.getFieldUpdates(bundle.self, [], true))
      )),
      map((fieldUpdates: FieldUpdates[]) => ([] as FieldUpdate[]).concat(
        ...fieldUpdates.map((updates: FieldUpdates) => Object.values(updates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE))
      )),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => fieldUpdate.field))
    );

    // Send out delete requests for all deleted bitstreams
    const removedResponses$ = removedBitstreams$.pipe(
      take(1),
      switchMap((removedBistreams: Bitstream[]) => {
        if (isNotEmpty(removedBistreams)) {
          return observableZip(...removedBistreams.map((bitstream: Bitstream) => this.bitstreamService.delete(bitstream.id)));
        } else {
          return observableOf(undefined);
        }
      })
    );
    this.subs.push(removedResponses$.pipe(take(1)).subscribe((responses: RemoteData<NoContent>[]) => {
      // TODO this shouldn't be necessary?
      this.checkForExistingAnnotationFile(this.annotationBundle);

      this.showSave = false;
      this.showUploader = true;
      this.changeDetector.detectChanges();
    }));


  }
  /**
   * Sends a new remove update for to the object updates service to remove the
   * annotation file from the bundle.
   */
  remove(): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.annotationBundle._links.self.href, this.annotationBitstream);
    this.showSave = true;
    this.activeStatus = true;
    this.changeDetector.detectChanges();
  }

  onCancel() {
    // this.translateService.instant(this.notificationsPrefix + key + '.title');
    // this.translateService.instant(this.notificationsPrefix + key + '.content');
    const undoNotification = this.notificationsService.info('discard change', 'removed discard', {timeOut: this.discardTimeOut});
    this.objectUpdatesService.discardAllFieldUpdates(this.annotationBundle._links.self.href, undoNotification);
    this.showSave = false;
    this.activeStatus = false;
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
