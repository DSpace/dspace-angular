import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { BehaviorSubject, combineLatest, Observable, of as observableOf, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  find,
  map,
  mergeMap,
  startWith
} from 'rxjs/operators';

import { Collection } from '../../../core/shared/collection.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { hasValue, isEmpty, isNotEmpty } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { PaginatedList } from '../../../core/data/paginated-list';
import { SubmissionService } from '../../submission.service';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';
import { SearchService } from '../../../+search-page/search-service/search.service';
import { PaginatedSearchOptions } from '../../../+search-page/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { getSucceededRemoteData } from '../../../core/shared/operators';
import { SearchResult } from '../../../+search-page/search-result.model';

/**
 * An interface to represent a collection entry
 */
interface CollectionListEntryItem {
  id: string;
  name: string;
}

/**
 * An interface to represent an entry in the collection list
 */
interface CollectionListEntry {
  communities: CollectionListEntryItem[],
  collection: CollectionListEntryItem
}

/**
 * This component allows to show the current collection the submission belonging to and to change it.
 */
@Component({
  selector: 'ds-submission-form-collection',
  styleUrls: ['./submission-form-collection.component.scss'],
  templateUrl: './submission-form-collection.component.html'
})
export class SubmissionFormCollectionComponent implements OnChanges, OnInit {

  /**
   * The current collection id this submission belonging to
   * @type {string}
   */
  @Input() currentCollectionId: string;

  /**
   * The current configuration object that define this submission
   * @type {SubmissionDefinitionsModel}
   */
  @Input() currentDefinition: string;

  /**
   * The submission id
   * @type {string}
   */
  @Input() submissionId;

  /**
   * An event fired when a different collection is selected.
   * Event's payload equals to new SubmissionObject.
   */
  @Output() collectionChange: EventEmitter<SubmissionObject> = new EventEmitter<SubmissionObject>();

  /**
   * A boolean representing if this dropdown button is disabled
   * @type {BehaviorSubject<boolean>}
   */
  public disabled$ = new BehaviorSubject<boolean>(true);

  /**
   * The search form control
   * @type {FormControl}
   */
  public searchField: FormControl = new FormControl();

  /**
   * The collection list obtained from a search
   * @type {Observable<CollectionListEntry[]>}
   */
  public searchListCollection$: Observable<CollectionListEntry[]>;

  /**
   * The selected collection id
   * @type {string}
   */
  public selectedCollectionId: string;

  /**
   * The selected collection name
   * @type {Observable<string>}
   */
  public selectedCollectionName$: Observable<string>;

  /**
   * The JsonPatchOperationPathCombiner object
   * @type {JsonPatchOperationPathCombiner}
   */
  protected pathCombiner: JsonPatchOperationPathCombiner;

  /**
   * A boolean representing if dropdown list is scrollable to the bottom
   * @type {boolean}
   */
  private scrollableBottom = false;

  /**
   * A boolean representing if dropdown list is scrollable to the top
   * @type {boolean}
   */
  private scrollableTop = false;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  private subs: Subscription[] = [];

  /**
   * Initialize instance variables
   *
   * @param {ChangeDetectorRef} cdr
   * @param {CommunityDataService} communityDataService
   * @param {JsonPatchOperationsBuilder} operationsBuilder
   * @param {SubmissionJsonPatchOperationsService} operationsService
   * @param {SubmissionService} submissionService
   * @param {SearchService} searchService
   */
  constructor(protected cdr: ChangeDetectorRef,
              private communityDataService: CommunityDataService,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private operationsService: SubmissionJsonPatchOperationsService,
              private submissionService: SubmissionService,
              private searchService: SearchService) {
  }

  /**
   * Method called on mousewheel event, it prevent the page scroll
   * when arriving at the top/bottom of dropdown menu
   *
   * @param event
   *     mousewheel event
   */
  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (event.wheelDelta > 0 && this.scrollableTop) {
      event.preventDefault();
    }
    if (event.wheelDelta < 0 && this.scrollableBottom) {
      event.preventDefault();
    }
  }

  /**
   * Check if dropdown scrollbar is at the top or bottom of the dropdown list
   *
   * @param event
   */
  onScroll(event) {
    this.scrollableBottom = (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight);
    this.scrollableTop = (event.target.scrollTop === 0);
  }

  /**
   * Initialize collection list
   */
  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.currentCollectionId)
      && hasValue(changes.currentCollectionId.currentValue)) {
      this.selectedCollectionId = this.currentCollectionId;

      // // @TODO replace with search/top browse endpoint
      // // @TODO implement community/subcommunity hierarchy
      // const communities$ = this.communityDataService.findAll().pipe(
      //   find((communities: RemoteData<PaginatedList<Community>>) => isNotEmpty(communities.payload)),
      //   mergeMap((communities: RemoteData<PaginatedList<Community>>) => communities.payload.page));

      const listCollection$: Observable<CollectionListEntry[]> = this.searchService.search(
        new PaginatedSearchOptions({
          dsoType: DSpaceObjectType.COLLECTION,
          pagination: new PaginationComponentOptions(),
          scope: 'c0e4de93-f506-4990-a840-d406f6f2ada7'
        })
      ).pipe(
        getSucceededRemoteData(),
        map((collections: RemoteData<PaginatedList<SearchResult<Collection>>>) => collections.payload.page),
        filter((collectionData: Array<SearchResult<Collection>>) => isNotEmpty(collectionData)),
        map((collectionData: Array<SearchResult<Collection>>) => {
          return collectionData.map((collection: SearchResult<Collection>) => {
            return {
              communities: [{
                id: 'c0e4de93-f506-4990-a840-d406f6f2ada7',
                name: 'Submission test'
              }],
              collection: { id: collection.indexableObject.id, name: collection.indexableObject.name }
            }
          })
        })
      );

      this.selectedCollectionName$ = listCollection$.pipe(
        map((collectionData: CollectionListEntry[]) => collectionData.find((entry: CollectionListEntry) => entry.collection.id === this.selectedCollectionId)),
        filter((entry: CollectionListEntry) => hasValue(entry.collection)),
        map((entry: CollectionListEntry) => entry.collection.name),
        startWith('')
      );

      const searchTerm$ = this.searchField.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        startWith('')
      );

      this.searchListCollection$ = combineLatest(searchTerm$, listCollection$).pipe(
        map(([searchTerm, listCollection]) => {
          this.disabled$.next(isEmpty(listCollection));
          if (isEmpty(searchTerm)) {
            return listCollection;
          } else {
            return listCollection.filter((v) => v.collection.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1).slice(0, 5);
          }
        }));
    }
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', 'collection');
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Emit a [collectionChange] event when a new collection is selected from list
   *
   * @param event
   *    the selected [CollectionListEntryItem]
   */
  onSelect(event) {
    this.searchField.reset();
    this.disabled$.next(true);
    this.operationsBuilder.replace(this.pathCombiner.getPath(), event.collection.id, true);
    this.subs.push(this.operationsService.jsonPatchByResourceID(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      'sections',
      'collection')
      .subscribe((submissionObject: SubmissionObject[]) => {
        this.selectedCollectionId = event.collection.id;
        this.selectedCollectionName$ = observableOf(event.collection.name);
        this.collectionChange.emit(submissionObject[0]);
        this.submissionService.changeSubmissionCollection(this.submissionId, event.collection.id);
        this.disabled$.next(false);
        this.cdr.detectChanges();
      })
    );
  }

  /**
   * Reset search form control on dropdown menu close
   */
  onClose() {
    this.searchField.reset();
  }

  /**
   * Reset search form control when dropdown menu is closed
   *
   * @param isOpen
   *    Representing if the dropdown menu is open or not.
   */
  toggled(isOpen: boolean) {
    if (!isOpen) {
      this.searchField.reset();
    }
  }
}
