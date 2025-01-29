import { Component, EventEmitter, Inject, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import {Observable} from 'rxjs';
import {Item} from '../../../core/shared/item.model';
import {MetadataValue} from '../../../core/shared/metadata.models';
import {ObjectUpdatesService} from '../../../core/data/object-updates/object-updates.service';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';
import { hasValue } from '../../../shared/empty.util';

interface ItemDTO {
  item: Item;
  isSelectedVirtualMetadata$: Observable<boolean>;
}

@Component({
  selector: 'ds-virtual-metadata',
  templateUrl: './virtual-metadata.component.html'
})
/**
 * Component that lists both items of a relationship, along with their virtual metadata of the relationship.
 * The component is shown when a relationship is marked to be deleted.
 * Each item has a checkbox to indicate whether its virtual metadata should be saved as real metadata.
 */
export class VirtualMetadataComponent implements OnInit, OnChanges {

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * The id of the relationship to be deleted.
   */
  @Input() relationshipId: string;

  /**
   * The left item of the relationship to be deleted.
   */
  @Input() leftItem: Item;

  /**
   * The right item of the relationship to be deleted.
   */
  @Input() rightItem: Item;

  /**
   * Emits when the close button is pressed.
   */
  @Output() close = new EventEmitter();

  /**
   * Emits when the save button is pressed.
   */
  @Output() save = new EventEmitter();

  /**
   * Indicates when thumbnails are required by configuration and therefore
   * need to be hidden in the modal layout.
   */
  showThumbnails: boolean;

  /**
   * Array of the left and the right item of the relationship to be deleted.
   */
  itemDTOs: [ItemDTO, ItemDTO] = [undefined, undefined];

  public virtualMetadata: Map<string, VirtualMetadata[]> = new Map<string, VirtualMetadata[]>();

  constructor(
    protected objectUpdatesService: ObjectUpdatesService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
  }

  /**
   * Get the virtual metadata of a given item corresponding to this relationship.
   * @param item  the item to get the virtual metadata for
   */
  getVirtualMetadata(item: Item): VirtualMetadata[] {

    return Object.entries(item.metadata)
      .map(([key, value]) =>
        value
          .filter((metadata: MetadataValue) =>
            !key.startsWith('relation') && metadata.authority && metadata.authority.endsWith(this.relationshipId))
          .map((metadata: MetadataValue) => {
            return {
              metadataField: key,
              metadataValue: metadata,
            };
          })
      )
      .reduce((previous, current) => previous.concat(current), []);
  }

  /**
   * Select/deselect the virtual metadata of an item to be saved as real metadata.
   * @param item      the item for which (not) to save the virtual metadata as real metadata
   * @param selected  whether or not to save the virtual metadata as real metadata
   */
  setSelectedVirtualMetadataItem(item: Item, selected: boolean) {
    this.objectUpdatesService.setSelectedVirtualMetadata(this.url, this.relationshipId, item.uuid, selected);
  }

  /**
   * Check whether the virtual metadata of a given item is selected to be saved as real metadata
   * @param item  the item for which to check whether the virtual metadata is selected to be saved as real metadata
   */
  isSelectedVirtualMetadataItem(item: Item): Observable<boolean> {
    return this.objectUpdatesService.isSelectedVirtualMetadata(this.url, this.relationshipId, item.uuid);
  }

  /**
   * Prevent unnecessary rerendering so fields don't lose focus
   */
  trackItem(index, itemDTO: ItemDTO) {
    return itemDTO?.item?.uuid;
  }

  ngOnInit(): void {
    this.virtualMetadata.set(this.leftItem.uuid, this.getVirtualMetadata(this.leftItem));
    this.virtualMetadata.set(this.rightItem.uuid, this.getVirtualMetadata(this.rightItem));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((hasValue(changes.leftItem) || hasValue(changes.rightItem)) && hasValue(this.leftItem) && hasValue(this.rightItem)) {
      this.itemDTOs = [
        {
          item: this.leftItem,
          isSelectedVirtualMetadata$: this.isSelectedVirtualMetadataItem(this.leftItem),
        },
        {
          item: this.rightItem,
          isSelectedVirtualMetadata$: this.isSelectedVirtualMetadataItem(this.rightItem),
        },
      ];
    }
  }
}

/**
 * Represents a virtual metadata entry.
 */
export interface VirtualMetadata {
  metadataField: string;
  metadataValue: MetadataValue;
}
