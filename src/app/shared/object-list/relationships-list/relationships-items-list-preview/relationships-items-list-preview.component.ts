import { Component, OnInit, Input } from '@angular/core';
import { fadeInOut } from '../../../animations/fade';
import { Item } from '../../../../core/shared/item.model';
import { SearchResult } from '../../../search/search-result.model';
import { DuplicateMatchMetadataDetailConfig } from '../../../../submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';

@Component({
  selector: 'ds-relationships-items-list-preview',
  templateUrl: './relationships-items-list-preview.component.html',
  styleUrls: ['./relationships-items-list-preview.component.scss'],
  animations: [fadeInOut]
})
export class RelationshipsItemsListPreviewComponent implements OnInit {


  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The custom information object
   */
  @Input() customData: any;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * An object representing the duplicate match
   */
  @Input() metadataList: DuplicateMatchMetadataDetailConfig[] = [];


  ngOnInit(): void {
    // console.log(this.item);
  }
}
