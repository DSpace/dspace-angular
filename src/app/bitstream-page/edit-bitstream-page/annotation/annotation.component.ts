import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { expand, filter, map, switchMap, take } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { Item } from '../../../core/shared/item.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { EMPTY, Observable, Subscription } from 'rxjs';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { ActivatedRoute } from '@angular/router';
import { hasNoValue, hasValue } from '../../../shared/empty.util';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { AnnotationUploadComponent } from '../annotation-upload/annotation-upload.component';
import { BUNDLE_NAME } from './annotation-properties';
import { followLink, FollowLinkConfig } from '../../../shared/utils/follow-link-config.model';
import { RemoteData } from '../../../core/data/remote-data';
import { ItemDataService } from '../../../core/data/item-data.service';


const BITSTREAM_LINKS_TO_FOLLOW: FollowLinkConfig<Item>[] = [
      followLink('bundles', {},
        followLink('bitstreams', {}))
  ];

/**
 * Parent container for the annotation uploader.
 */
@Component({
  selector: 'ds-iiif-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationComponent implements OnInit, OnDestroy {

  @ViewChild(AnnotationUploadComponent) annotationUploaderComponent: AnnotationUploadComponent;
  /**
   * The parent item of the current bitstream
   */
  item$: Observable<Item>;
  /**
   * The ANNOTATIONS bundle of the current item.
   */
  annotationBundle: Bundle;
  /**
   * The annotation file bitstream DSO.
   */
  annotationFile: Bitstream;
  /**
   * The annotation file name.
   */
  annotationFileTitle: string;
  /**
   * Used to add or remove the child annotation uploader component from the view.
   */
  showComponent = false;
  /**
   * Used to set the button type in the view.
   */
  uploadButton = true;
  /**
   * Used to show the button after it's type has been set.
   */
  showButton: boolean;
  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected changeDetector: ChangeDetectorRef,
    protected itemService: ItemDataService,
    protected bitstreamService: BitstreamDataService ) {
  }

  ngOnInit(): void {

    // Get bitstream data and item from the current route
    const itemRD$ = this.route.data.pipe(
      map((data: { bitstream: RemoteData<Bitstream>, breadcrumb: any }) => {
        this.annotationFileTitle = this.getAnnotationFileName(data.bitstream.payload.id);
        return data.bitstream;
      }),
      switchMap((bitstream: RemoteData<Bitstream>) => {
        this.item$ = this.getItem(bitstream.payload);
        return this.item$;
      }));

    // Request un-cached bundles.
    this.subs.push(itemRD$.pipe(
      switchMap((item: Item) => this.itemService.findById(item.uuid, false, true, ...BITSTREAM_LINKS_TO_FOLLOW)),
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((item: Item) => this.getItemBundles(item)
      )).subscribe(
      (bundles: PaginatedList<Bundle>) => {
        // Check for an annotations bundle.
        this.checkForExistingAnnotationBundle(bundles);
      }));

  }

  /**
   * Called when an annotation file is added or deleted in the child component.
   * @param input
   */
  changeStatus(input: any): void {
    this.annotationFile = input[0];
    this.annotationBundle = input[1];
    this.uploadButton = hasNoValue(this.annotationFile);
    this.ngOnInit();
    this.annotationUploaderComponent.ngAfterViewInit();
    this.toggleComponent();
  }

  /**
   * Toggles the child uploader component view.
   */
  toggleComponent(): void {
    this.showComponent = !this.showComponent;
  }

  /**
   * Gets observable of the parent item of the current bitstream.
   * @param bitstreamRD$
   */
  private getItem(bitstream: Bitstream): Observable<Item> {
    return bitstream.bundle.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      switchMap((bundle: Bundle) => bundle.item.pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload())
      ));
  }

  /**
   * Gets observable of the bundles from the item.
   * @param item
   */
  private getItemBundles(item: Item): Observable<PaginatedList<Bundle>> {
    return item.bundles.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
    );
  }

  /**
   * Looks for an existing annotations bundle. If it exists, checks
   * for a matching file in the annotations bundle. If not
   * present shows the upload button.
   * @param bundleList
   * @param item
   */
  private checkForExistingAnnotationBundle(bundleList: PaginatedList<Bundle>): void {
    if (bundleList.page) {
      const bundleCount = bundleList.page.filter((bundle: Bundle) => bundle.name === BUNDLE_NAME)
        .map((bundle: Bundle) => {
          this.annotationBundle = bundle;
          this.checkForExistingAnnotationFile(bundle);
        });
      if (bundleCount.length === 0) {
        // if no annotation bundle was found, show the upload button.
        this.uploadButton = true;
      }
    }
    this.showButton = true;
    this.changeDetector.detectChanges();
  }

  /**
   * Checks for matching file in the annotations bundle. If found,
   * sets the annotationFile property and updates the button style.
   * @param annotationsBundle bundle
   */
  private checkForExistingAnnotationFile(annotationsBundle: Bundle): void {
    this.subs.push(this.lookForBitstream(annotationsBundle, this.annotationFileTitle)
      .subscribe((bitstream: Bitstream) => {
        this.annotationFile = bitstream;
        // if bitstream was found update the button style.
        this.uploadButton = false;
        this.changeDetector.detectChanges();
      })
    );
  }

  /**
   * Looks for the annotation file in the ANNOTATIONS Bundle.
   * @param annotationBundle
   * @param annotationFileTitle
   */
  private lookForBitstream(annotationBundle: Bundle, annotationFileTitle: string): Observable<Bitstream> {
    return annotationBundle.bitstreams.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      expand((paginatedList: PaginatedList<Bitstream>) => {
        if (hasNoValue(paginatedList.next)) {
          // If there's no next page, stop.
          return EMPTY;
        } else {
          // Otherwise retrieve the next page
          return this.bitstreamService.findListByHref(
            paginatedList.next, {elementsPerPage: 40}, true, true,).pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload(),
            map((next: PaginatedList<Bitstream>) => {
              if (hasValue(next)) {
                return next;
              } else {
                return EMPTY;
              }
            })
          );
        }
      }),
      switchMap((paginatedList: PaginatedList<Bitstream>) => {
        if (hasValue(paginatedList.page)) {
          return paginatedList.page;
        }
      }),
      filter((bitstream: Bitstream) => bitstream.metadata['dc.title'][0].value === annotationFileTitle),
      take(1)
    );
  }

  /**
   * Returns the annotation file name for the current bitstream.
   * @param uuid
   */
  private getAnnotationFileName(uuid: string): string {
    return uuid + '.json';
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
