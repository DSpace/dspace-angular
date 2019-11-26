import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Item} from '../../../core/shared/item.model';
import {Relationship} from '../../../core/shared/item-relationships/relationship.model';
import {MetadataValue} from '../../../core/shared/metadata.models';
import {getRemoteDataPayload, getSucceededRemoteData} from '../../../core/shared/operators';
import {ObjectUpdatesService} from '../../../core/data/object-updates/object-updates.service';

@Component({
  selector: 'ds-virtual-metadata',
  templateUrl: './virtual-metadata.component.html'
})
/**
 * Component that handles the moving of an item to a different collection
 */
export class VirtualMetadataComponent implements OnChanges {

  /**
   * The current url of this page
   */
  @Input() url: string;

  @Input() relationship: Relationship;

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  leftItem$: Observable<Item>;
  rightItem$: Observable<Item>;

  constructor(
    protected route: ActivatedRoute,
    protected objectUpdatesService: ObjectUpdatesService,
  ) {
  }

  ngOnChanges(): void {
    this.leftItem$ = this.relationship.leftItem.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
    );
    this.rightItem$ = this.relationship.rightItem.pipe(
      getSucceededRemoteData(),
      getRemoteDataPayload(),
    );
  }

  getVirtualMetadata(relationship: Relationship, relatedItem: Item): VirtualMetadata[] {

    return this.objectUpdatesService.getVirtualMetadataList(relationship, relatedItem);
  }

  setSelectedVirtualMetadataItem(item: Item, selected: boolean) {
    this.objectUpdatesService.setSelectedVirtualMetadataItem(this.url, this.relationship.id, item.uuid, selected);
  }

  isSelectedVirtualMetadataItem(item: Item): Observable<boolean> {
    return this.objectUpdatesService.isSelectedVirtualMetadataItem(this.url, this.relationship.id, item.uuid);
  }
}

export interface VirtualMetadata {
  metadataField: string,
  metadataValue: MetadataValue,
}
