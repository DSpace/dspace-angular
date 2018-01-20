import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { isNullOrUndefined } from 'util';
import { Collection } from '../../../core/shared/collection.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { Community } from '../../../core/shared/community.model';
import { hasUndefinedValue, hasValue, isNotEmpty } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { SubmissionRestService } from '../../submission-rest.service';
import { Workspaceitem } from '../../models/workspaceitem.model';

@Component({
  selector: 'ds-submission-submit-form-collection',
  styleUrls: ['./submission-submit-form-collection.component.scss'],
  templateUrl: './submission-submit-form-collection.component.html'
})
export class SubmissionSubmitFormCollectionComponent implements OnChanges, OnInit {
  @Input() currentCollectionId: string;
  @Input() submissionId;

  /**
   * An event fired when a different collection is selected.
   * Event's payload equals to new collection uuid.
   */
  @Output() collectionChange: EventEmitter<Workspaceitem> = new EventEmitter<Workspaceitem>();

  public disabled = true;
  public listCollection = [];
  public model: any;
  public searchField: FormControl;
  public searchListCollection = [];
  public selectedCollectionId: string;
  public selectedCollectionName: string;

  protected pathCombiner: JsonPatchOperationPathCombiner;
  private scrollableBottom = false;
  private scrollableTop = false;
  private subs: Subscription[] = [];

  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (event.wheelDelta > 0 && this.scrollableTop) {
      event.preventDefault();
    }
    if (event.wheelDelta < 0 && this.scrollableBottom) {
      event.preventDefault();
    }
  }

  constructor(private communityDataService: CommunityDataService,
              private operationsBuilder: JsonPatchOperationsBuilder,
              private restService: SubmissionRestService) {}

  onScroll(event) {
    this.scrollableBottom = (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight);
    this.scrollableTop = (event.target.scrollTop === 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (hasValue(changes.currentCollectionId)
      && hasValue(changes.currentCollectionId.currentValue)
      && !isNotEmpty(this.listCollection)) {
      this.selectedCollectionId = this.currentCollectionId;
      // @TODO replace with search/top browse endpoint
      // @TODO implement community/subcommunity hierarchy
      this.subs.push(this.communityDataService.findAll()
        .filter((communities: RemoteData<Community[]>) => isNotEmpty(communities.payload))
        .first()
        .switchMap((communities: RemoteData<Community[]>) => communities.payload)
        .subscribe((communityData: Community) => {
          this.subs.push( communityData.collections
            .filter((collections: RemoteData<Collection[]>) => isNotEmpty(collections.payload) && !hasUndefinedValue(collections.payload))
            .first()
            .switchMap((collections: RemoteData<Collection[]>) => collections.payload)
            .subscribe((collectionData: Collection) => {
              if (collectionData.id === this.selectedCollectionId) {
                this.selectedCollectionName = collectionData.name;
              }
              const collectionEntry = {
                communities: [{id: communityData.id, name: communityData.name}],
                collection: {id: collectionData.id, name: collectionData.name}
              };
              this.listCollection.push(collectionEntry);
              this.searchListCollection.push(collectionEntry);
              this.disabled = false;
            }))
        }));
    }
  }

  ngOnInit() {
    this.pathCombiner = new JsonPatchOperationPathCombiner('sections', 'collection');
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((term) => {
        this.search(term);
      });
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  search(text: string) {
    if (text === '' || isNullOrUndefined(text)) {
      this.searchListCollection = this.listCollection;
    } else {
      this.searchListCollection = this.listCollection.filter((v) => v.collection.name.toLowerCase().indexOf(text.toLowerCase()) > -1).slice(0, 5);
    }
  }

  formatter = (x: {collection: string}) => x.collection;

  onSelect(event) {
    this.searchField.reset();
    this.searchListCollection = this.listCollection;
    this.disabled = true;
    this.operationsBuilder.replace(this.pathCombiner.getPath(), event.collection.id, true);
    this.restService.jsonPatchByResourceID(this.submissionId, 'sections', 'collection')
      .subscribe((workspaceitems: Workspaceitem[]) => {
        this.selectedCollectionId = event.collection.id;
        this.selectedCollectionName = event.collection.name;
        this.collectionChange.emit(workspaceitems[0]);
        this.disabled = false;
      })
  }

  onClose(event) {
    this.searchField.reset();
  }
}
