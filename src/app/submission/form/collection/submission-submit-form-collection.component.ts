import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { isNullOrUndefined } from 'util';
import { Collection } from '../../../core/shared/collection.model';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { Community } from '../../../core/shared/community.model';
import { hasValue } from '../../../shared/empty.util';
import { RemoteData } from '../../../core/data/remote-data';

@Component({
  selector: 'ds-submission-submit-form-collection',
  styleUrls: ['./submission-submit-form-collection.component.scss'],
  templateUrl: './submission-submit-form-collection.component.html'
})
export class SubmissionSubmitFormCollectionComponent implements OnInit {
  @Input() currentCollectionId: string;

  /**
   * An event fired when a different collection is selected.
   * Event's payload equals to new collection uuid.
   */
  @Output() collectionChange: EventEmitter<string> = new EventEmitter<string>();

  public listCollection = [];
  public model: any;
  public searchField: FormControl;
  public searchListCollection = [];
  public selectedCollectionId: string;
  public selectedCollectionName: string;

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

  constructor(private communityDataService: CommunityDataService) {}

  onScroll(event) {
    this.scrollableBottom = (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight);
    this.scrollableTop = (event.target.scrollTop === 0);
  }

  ngOnInit() {
    this.selectedCollectionId = this.currentCollectionId;
    // @TODO replace with search/top browse endpoint
    // @TODO implement community/subcommunity hierarchy
    this.subs.push(this.communityDataService.findAll()
      .subscribe((communities: RemoteData<Community[]>) => {
        const collectionsList = [];
        communities.payload.forEach((communityData) => {
          this.subs.push(communityData.collections
            .subscribe((collections: RemoteData<Collection[]>) => {
              // @TODO checks why collections are subscribed twice
              collections.payload.forEach((collectionData: Collection) => {
                if (collectionData.id === this.selectedCollectionId) {
                  this.selectedCollectionName = collectionData.name;
                }
                const collectionEntry = {
                  communities: [{id: communityData.id, name: communityData.name}],
                  collection: {id: collectionData.id, name: collectionData.name}
                };
                if (!collectionsList.some((obj) => collectionEntry.collection.id === obj.collection.id)) {
                  collectionsList.push(collectionEntry);
                }
              })
            }));
        });
        this.listCollection = collectionsList;
        this.searchListCollection = collectionsList;
      }));

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
    this.selectedCollectionId = event.collection.id;
    this.selectedCollectionName = event.collection.name;
    this.searchListCollection = this.listCollection;
    this.collectionChange.emit(this.selectedCollectionId);
  }

  onClose(event) {
    this.searchField.reset();
  }
}
