import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { expand, filter, map, switchMap, take } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { Bundle } from '../../../core/shared/bundle.model';
import { Item } from '../../../core/shared/item.model';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getRemoteDataPayload
} from '../../../core/shared/operators';
import { ActivatedRoute } from '@angular/router';
import { hasNoValue, hasValue } from '../../../shared/empty.util';
import { BitstreamDataService } from '../../../core/data/bitstream-data.service';
import { AnnotationUploadComponent } from '../annotation-upload/annotation-upload.component';


/**
 * The bundle that contains annotation files.
 */
export const BUNDLE_NAME = 'ANNOTATIONS';

/**
 * Parent container for the annotation uploader.
 */
@Component({
  selector: 'ds-iiif-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationComponent implements OnInit {

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
  annotationMissing = true;

  /**
   * Used to show the button after it's type has been set.
   */
  showButton: boolean;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private bitstreamService: BitstreamDataService
  ) {}

  ngOnInit(): void {

    const bitstreamRD$ = this.route.data.pipe(map((data) =>  {
      this.annotationFileTitle = this.getAnnotationFileName(data.bitstream.payload.id);
      return data.bitstream;
    }));

    this.item$ = this.getItem(bitstreamRD$);

    const bundles$ = this.getItemBundles(this.item$);
    this.subs.push(bundles$.pipe(
    ).subscribe((bundles: PaginatedList<Bundle>) => {
      this.checkForExistingAnnotationBundle(bundles, this.item$);
    }));
  }

  /**
   * Called when an annotation file is added or deleted in the child component.
   * @param input
   */
  changeStatus(input: any): void {
    this.toggleComponent();
    this.annotationFile = input[0];
    this.annotationBundle = input[1];
    this.annotationMissing = hasNoValue(this.annotationFile);
    this.ngOnInit();
    this.annotationUploaderComponent.ngOnInit();
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
  getItem(bitstreamRD$: Observable<RemoteData<Bitstream>>): Observable<Item> {
    return bitstreamRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((bitstream: Bitstream) => bitstream.bundle.pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        switchMap((bundle: Bundle) => bundle.item.pipe(
          getFirstCompletedRemoteData(),
          getRemoteDataPayload())
        ))));
  }

  /**
   * Gets observable of the bundles from the item.
   * @param item$
   */
  getItemBundles(item$: Observable<Item>): Observable<PaginatedList<Bundle>> {
    return item$.pipe(
      switchMap((item: Item) => item.bundles.pipe(
        getFirstSucceededRemoteData(),
        getRemoteDataPayload(),
      ))
    );
  }


  /**
   * Looks for an existing annotations bundle.If the annotations bundle exists, calls
   * a function  to check for a matching file in the annotations bundle and updates
   * the view. Otherwise, create the missing bundle.
   * @param bundles
   * @param item
   */
  checkForExistingAnnotationBundle(bundles: PaginatedList<Bundle>, item: Observable<Item>): void {
    const bundleList = bundles.page.filter((bundle: Bundle) => bundle.name === BUNDLE_NAME)
      .map((bundle: Bundle) => {
      this.annotationBundle = bundle;
      this.checkForExistingAnnotationFile(bundle);
    });
    if (bundleList.length === 0) {
      this.showButton = true;
    }
    this.changeDetector.detectChanges();
  }


  /**
   * Checks for matching file in the annotations bundle. If found,
   * hides the 'ds-uploader' and shows the bitstream.
   * @param annotationsBundle bundle
   */
  checkForExistingAnnotationFile(annotationsBundle: Bundle): void {
    this.subs.push(this.lookForBitstream(annotationsBundle, this.annotationFileTitle)
      .subscribe((bitstream: Bitstream) => {
        this.annotationFile = bitstream;
        this.annotationMissing = false;
      })
    );
  }

  /**
   * Looks for the annotation file in the ANNOTATIONS bundle.
   * @param bundle
   * @param annotationFileTitle
   */
  lookForBitstream(bundle: Bundle, annotationFileTitle: string): Observable<Bitstream> {
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
        // at this point it's ok to show the toggle button
        this.showButton = true;
        if (hasValue(paginatedList.page)) {
          return paginatedList.page;
        }
      }),
      //tap((bitstream: Bitstream) => console.log(bitstream)),
      filter((bitstream: Bitstream) => bitstream.metadata['dc.title'][0].value === annotationFileTitle),
      //tap((bitstream: Bitstream) => console.log('found bitstream in annotation bundle')),
      take(1)
    );
  }

  /**
   * Returns the annotation file name for the current bitstream.
   * @param uuid
   */
  getAnnotationFileName(uuid: string): string {
    return uuid + '.json';
  }

}
