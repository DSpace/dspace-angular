import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter, Input,
  OnDestroy, Output,
  ViewChild
} from '@angular/core';
import {
  getFirstSucceededRemoteDataPayload
} from '../../../core/shared/operators';
import { Bundle } from '../../../core/shared/bundle.model';
import { ItemDataService } from '../../../core/data/item-data.service';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { hasValue, isEmpty } from '../../../shared/empty.util';
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
import { Subscription } from 'rxjs';
import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { FieldUpdates } from '../../../core/data/object-updates/field-updates.model';
import { FieldUpdate } from '../../../core/data/object-updates/field-update.model';
import { FieldChangeType } from '../../../core/data/object-updates/field-change-type.model';
import { NoContent } from '../../../core/shared/NoContent.model';
import { HttpXsrfTokenExtractor } from '@angular/common/http';
import { XSRF_REQUEST_HEADER } from '../../../core/xsrf/xsrf.interceptor';
import { ObjectCacheService } from '../../../core/cache/object-cache.service';
import { BUNDLE_NAME } from '../annotation/annotation-properties';
import { Identifiable } from '../../../core/data/object-updates/identifiable.model';


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

  constructor(
    private itemService: ItemDataService,
    private bundleService: BundleDataService,
    private requestService: RequestService,
    private authService: AuthService,
    private translate: TranslateService,
    private bitstreamService: BitstreamDataService,
    private changeDetector: ChangeDetectorRef,
    private objectCacheService: ObjectCacheService,
    private notificationsService: NotificationsService,
    private objectUpdateService: ObjectUpdatesService,
    private translateService: TranslateService,
    private tokenExtractor: HttpXsrfTokenExtractor
  ) {}

  ngAfterViewInit(): void {
    if (this.annotationBundle) {
      if (hasValue(this.uploaderComponent)) {
        this.setUploadUrl(this.annotationBundle);
      }
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
  private createAnnotationBundle(item: Item): void {
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
  private setUploadUrl(bundle: Bundle): void {
    this.subs.push(this.bundleService.getBitstreamsEndpoint(bundle.id).pipe(take(1))
      .subscribe((href: string) => {
      this.uploadFilesOptions.url = href;
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }
      // Re-initialize the ds-uploader to apply the options changes
      if (this.uploaderComponent) {
        this.updateTokens();
        this.uploaderComponent.ngOnInit();
        this.uploaderComponent.ngAfterViewInit();
      }
    }));
  }

  /**
   * Called after successful file upload.
   * @param bitstream
   */
  onCompleteItem(bitstream: Bitstream): void {
    bitstream.metadata['dc.title'][0].value = this.annotationFileTitle;
    this.subs.push(this.bitstreamService.update(bitstream).pipe(
      getFirstSucceededRemoteDataPayload()
    ).subscribe(() => {
      this.bitstreamService.commitUpdates();
      this.setBundleHrefToStale();
      this.notificationsService.success(
        this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'added.title'),
        this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'added.content'));
      // re-initialize components
      this.changeStatusEvent.emit([bitstream, this.annotationBundle]);
    }));
  }

  /**
   * Set the bundle bitstreams href to stale so the new file appears in the item-bitstreams view.
   */
  setBundleHrefToStale() {
    this.subs.push(this.bundleService.getBitstreamsEndpoint(this.annotationBundle.id).pipe(take(1))
      .subscribe((href: string) => {
        this.requestService.setStaleByHrefSubstring(href);
      }));
  }

  /**
   * The request was unsuccessful, display an error notification
   */
  onUploadError(): void {
    this.notificationsService.error(null, this.translate.get(this.NOTIFICATIONS_PREFIX + 'upload.failed'));
  }

  /**
   * This function is called when file deletion is confirmed by user.
   */
  saveChange(): void {
    let field: Identifiable;
    const removedBitstreams$ = this.objectUpdateService.getFieldUpdates(this.annotationBundle.self, [], true).pipe(
      map((fieldUpdates: FieldUpdates) => {
        return Object.values(fieldUpdates).filter((fieldUpdate: FieldUpdate) => fieldUpdate.changeType === FieldChangeType.REMOVE);
      }),
      map((fieldUpdates: FieldUpdate[]) => fieldUpdates.map((fieldUpdate: FieldUpdate) => {
        field = fieldUpdate.field;
        return fieldUpdate.field;
      })),
    );
    // Send out the delete request for the annotation bitstream
    const removedResponse$ = removedBitstreams$.pipe(
      take(1),
      switchMap((removedBitstreams: Bitstream[]) => {
        // there should be only one update
        if (removedBitstreams.length === 1) {
          return this.bitstreamService.delete(removedBitstreams[0].id);
        } else {
          // this should never happen
          this.notificationsService.error(
            this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.error'));
        }
      })
    );
    this.subs.push(removedResponse$.pipe(
      filter((response: RemoteData<NoContent>) => response.hasSucceeded || response.hasFailed),
      take(1)
    ).subscribe((response: RemoteData<NoContent>) => {
      if (response.hasSucceeded) {
        // Drop the REMOVE update from the store after successful delete.
        this.objectUpdateService.removeSingleFieldUpdate(this.annotationBundle.self, field.uuid);

        this.notificationsService.success(
          this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.title'),
          this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.content'));

        // Update the components.
        this.changeStatusEvent.emit([undefined, this.annotationBundle]);

      } else if (response.hasFailed) {
        this.notificationsService.error(
          this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'removed.error'));
      }

    }));
  }

  /**
   * Updates the 'ds-uploader' headers with the current CSRF and authorization tokens.
   */
  private updateTokens(): void {
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
    this.objectUpdateService.saveRemoveFieldUpdate(this.annotationBundle.self, this.annotationFile);
    this.activeDeleteStatus = true;
    this.changeDetector.detectChanges();
  }

  /**
   * Cancel the deletion update.
   */
  onCancel(): void {
    this.objectUpdateService.removeSingleFieldUpdate(this.annotationBundle.self, this.annotationFile.uuid);
    this.notificationsService.success(
      this.translateService.instant(this.NOTIFICATIONS_PREFIX + 'cancel.content'));
    this.activeDeleteStatus = false;
    this.changeDetector.detectChanges();
  }

  /**
   * Emits event to parent that will remove this component from the view.
   */
  closeView(): void {
    this.closeDialog.emit();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
