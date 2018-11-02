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
import { Subscription } from 'rxjs/Subscription';

import { isNullOrUndefined } from 'util';
import { Collection } from '../../../core/shared/collection.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { Community } from '../../../core/shared/community.model';
import { hasValue, isNotEmpty } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { Workspaceitem } from '../../../core/submission/models/workspaceitem.model';
import { PaginatedList } from '../../../core/data/paginated-list';
import { JsonPatchOperationsService } from '../../../core/json-patch/json-patch-operations.service';
import { SubmitDataResponseDefinitionObject } from '../../../core/shared/submit-data-response-definition.model';
import { SubmissionService } from '../../submission.service';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';
import { Observable } from 'rxjs/Observable';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  flatMap,
  map,
  mergeMap,
  reduce,
  startWith,
  tap
} from 'rxjs/operators';

interface CollectionListEntryItem {
  id: string;
  name: string;
}

interface CollectionListEntry {
  communities: CollectionListEntryItem[],
  collection: CollectionListEntryItem
}

@Component({
  selector: 'ds-submission-form-collection',
  styleUrls: ['./submission-form-collection.component.scss'],
  templateUrl: './submission-form-collection.component.html'
})
export class SubmissionFormCollectionComponent implements OnChanges, OnInit {
  @Input() currentCollectionId: string;
  @Input() currentDefinition: string;
  @Input() submissionId;

  /**
   * An event fired when a different collection is selected.
   * Event's payload equals to new collection uuid.
   */
  @Output() collectionChange: EventEmitter<Workspaceitem> = new EventEmitter<Workspaceitem>();

  public disabled = true;
  public model: any;
  public searchField: FormControl = new FormControl();
  public searchListCollection$: Observable<CollectionListEntry[]>;
  public selectedCollectionId: string;
  public selectedCollectionName: string;

  protected pathCombiner: JsonPatchOperationPathCombiner;
  private scrollableBottom = false;
  private scrollableTop = false;
  private subs: Subscription[] = [];

  formatter = (x: { collection: string }) => x.collection;

  constructor(protected cdr: ChangeDetectorRef,
              private communityDataService: CommunityDataService,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private operationsService: JsonPatchOperationsService<SubmitDataResponseDefinitionObject>,
              private submissionService: SubmissionService) {
  }

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (event.wheelDelta > 0 && this.scrollableTop) {
      event.preventDefault();
    }
    if (event.wheelDelta < 0 && this.scrollableBottom) {
      event.preventDefault();
    }
  }

  onScroll(event) {
    this.scrollableBottom = (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight);
    this.scrollableTop = (event.target.scrollTop === 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.currentCollectionId)
      && hasValue(changes.currentCollectionId.currentValue)) {

      this.selectedCollectionId = this.currentCollectionId;
      // @TODO replace with search/top browse endpoint
      // @TODO implement community/subcommunity hierarchy
      const listCollection$ = this.communityDataService.findAll().pipe(
        filter((communities: RemoteData<PaginatedList<Community>>) => isNotEmpty(communities.payload)),
        first(),
        mergeMap((communities: RemoteData<PaginatedList<Community>>) => communities.payload.page),
        flatMap((communityData: Community) => {
          return communityData.collections.pipe(
            filter((collections: RemoteData<PaginatedList<Collection>>) => !collections.isResponsePending && collections.hasSucceeded),
            first(),
            mergeMap((collections: RemoteData<PaginatedList<Collection>>) => collections.payload.page),
            filter((collectionData: Collection) => isNotEmpty(collectionData)),
            tap((collectionData: Collection) => {
              if (collectionData.id === this.selectedCollectionId) {
                this.selectedCollectionName = collectionData.name;
              }
            }),
            map((collectionData: Collection) => ({
              communities: [{id: communityData.id, name: communityData.name}],
              collection: {id: collectionData.id, name: collectionData.name}
            }))
          );
        }),
        reduce((acc: any, value: any) => [...acc, ...value], []),
        tap((list: CollectionListEntry[]) => {
          if (isNotEmpty(list)) {
            this.disabled = false;
          }
        }),
        startWith([])
      );

      const searchTerm$ = this.searchField.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        startWith('')
      );

      this.searchListCollection$ = Observable.combineLatest(searchTerm$, listCollection$)
        .map(([searchTerm, listCollection]) => {
          if (searchTerm === '' || isNullOrUndefined(searchTerm)) {
            return listCollection;
          } else {
            return listCollection.filter((v) => v.collection.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1).slice(0, 5)
          }
        });
    }
  }

  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', 'collection');
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  onSelect(event) {
    this.searchField.reset();
    this.disabled = true;
    this.operationsBuilder.replace(this.pathCombiner.getPath(), event.collection.id, true);
    this.subs.push(this.operationsService.jsonPatchByResourceID(
      this.submissionService.getSubmissionObjectLinkName(),
      this.submissionId,
      'sections',
      'collection')
      .subscribe((submissionObject: SubmissionObject[]) => {
        this.selectedCollectionId = event.collection.id;
        this.selectedCollectionName = event.collection.name;
        this.collectionChange.emit(submissionObject[0]);
        this.submissionService.changeSubmissionCollection(this.submissionId, event.collection.id);
        this.disabled = false;
        this.cdr.detectChanges();
      })
    );
  }

  onClose() {
    this.searchField.reset();
  }

  toggled(isOpen: boolean) {
    if (!isOpen) {
      this.searchField.reset();
    }
  }
}
