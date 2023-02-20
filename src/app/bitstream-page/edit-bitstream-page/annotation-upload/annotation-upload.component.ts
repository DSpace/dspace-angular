import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
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
import { map, switchMap, take } from 'rxjs/operators';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { BundleDataService } from '../../../core/data/bundle-data.service';
import { UploaderOptions } from '../../../shared/upload/uploader/uploader-options.model';
import { UploaderComponent } from '../../../shared/upload/uploader/uploader.component';
import { AuthService } from '../../../core/auth/auth.service';;
import { RequestService } from '../../../core/data/request.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { Observable, of as observableOf, zip as observableZip } from 'rxjs';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { NoContent } from '../../../core/shared/NoContent.model';

@Component({
  selector: 'ds-iiif-annotation-upload',
  styleUrls: ['./annotation-upload.component.scss'],
  templateUrl: './annotation-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationUploadComponent implements OnInit {

  BUNDLE_NAME = "ANNOTATIONS";

  /**
   * The file uploader component
   */
  @ViewChild(UploaderComponent) uploaderComponent: UploaderComponent;

  bitstream: Bitstream;

  @Input() itemId: string;

  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  annotationBundle: Bundle;

  showUploader: boolean;

  annotationBitstream: Bitstream;

  annotationFileName: string;

  itemDSO: Item;

  showSave = false;

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
              private objectUpdatesService: ObjectUpdatesService,) {}

  ngOnInit(): void {
    // TODO test by removing followLink cache param for item
    // TODO this way, or bring the RD observable in from the parent component?
    // TODO look into destroying subscriptions...
    this.bitstreamRD$ = this.route.data.pipe(map((data) =>  {
      return data.bitstream
    }));
    this.bitstreamRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload()
    ).subscribe((bitstream: Bitstream) => {
          bitstream.bundle.pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload(),
            switchMap((bundle: Bundle) => {
              return bundle.item.pipe(
                getFirstCompletedRemoteData()
              )
            })
          ).subscribe(
            (item: RemoteData<Item>) => {
              this.itemDSO = item.payload;
              item.payload.bundles.pipe(
                getFirstCompletedRemoteData()
              ).subscribe((bundles: RemoteData<PaginatedList<Bundle>>) => {
                this.checkForExistingAnnotationBundle(bundles.payload, item.payload);
                this.setUploadUrl();
                this.changeDetector.detectChanges();
                }
              );
            }
          )
    });
  }

  checkForExistingAnnotationBundle(bundles: PaginatedList<Bundle>, item: Item): void {
    const matchingBundle = bundles.page.find((bundle: Bundle) =>
      bundle.name === this.BUNDLE_NAME);
    if (!hasValue(matchingBundle)) {
      this.createAnnotationBundle(item);
      // show uploader
      this.showUploader = true;
    } else {
      // Use the existing annotations bundle and check for files
      this.annotationBundle = matchingBundle;
      this.checkForExistingAnnotationFile(matchingBundle);
    }
  }

  checkForExistingAnnotationFile(bundle: Bundle) {
    bundle.bitstreams.pipe(
      getFirstCompletedRemoteData())
      .subscribe((bitstreams: RemoteData<PaginatedList<Bitstream>>) => {
        // If there are no files in the bundle show the uploader.
        if (bitstreams.payload.pageInfo.totalElements === 0) {
          this.showUploader = true;
          console.log('show')
        } else {
          this.annotationBitstream = bitstreams.payload.page.shift();
          this.showUploader = false;
          this.annotationFileName = this.annotationBitstream.metadata['dc.title'][0].value;
        }
        this.changeDetector.detectChanges();
      });
  }

  createAnnotationBundle(item: Item) {
    this.itemService.createBundle(item.id, this.BUNDLE_NAME).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe((bundle: Bundle) => {
      this.annotationBundle = bundle;
    });
  }

  /**
   * Set the upload url to match the selected bundle ID
   */
  setUploadUrl() {
    this.bundleService.getBitstreamsEndpoint(this.annotationBundle.id).pipe(take(1)).subscribe((href: string) => {
      this.uploadFilesOptions.url = href;
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }
      // Re-initialize the uploader component to ensure the latest changes to the options are applied
      if (this.uploaderComponent) {
        this.uploaderComponent.ngOnInit();
        this.uploaderComponent.ngAfterViewInit();
      }
    });
  }

  /**
   * The request was successful, update the page.
   * @param bitstream
   */
  public onCompleteItem(bitstream: Bitstream) {
    bitstream.metadata['dc.title'][0].value = bitstream.id + ".json";
    this.bitstreamService.update(bitstream).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.annotationBitstream = bitstream;
      this.annotationFileName = bitstream.metadata['dc.title'][0].value;
      this.showSave = false;
      this.showUploader = false;
      this.changeDetector.detectChanges();
    });

    // TODO is this needed?
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
        return bundleList.page
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
    removedResponses$.pipe(take(1)).subscribe((responses: RemoteData<NoContent>[]) => {
      this.checkForExistingAnnotationFile(this.annotationBundle);
      this.showSave = false;
      this.showUploader = true;
      this.changeDetector.detectChanges();
    });


  }
  /**
   * Sends a new remove update for to the object updates service
   */
  remove(): void {
    this.objectUpdatesService.saveRemoveFieldUpdate(this.annotationBundle._links.self.href, this.annotationBitstream);
    this.showSave = true;
    this.changeDetector.detectChanges();
  }

}
