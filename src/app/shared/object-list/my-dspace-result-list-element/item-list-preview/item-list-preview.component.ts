import { Component, Inject, Input, OnInit } from '@angular/core';

import { Item } from '../../../../core/shared/item.model';
import { fadeInOut } from '../../../animations/fade';
import {
  MyDspaceItemStatusType
} from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SearchResult } from '../../../search/models/search-result.model';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { DuplicateMatchMetadataDetailConfig } from '../../../../submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';

/**
 * This component show metadata for the given item object in the list view.
 */
@Component({
  selector: 'ds-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut]
})
export class ItemListPreviewComponent implements OnInit {

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * Represent item's status
   */
  @Input() status: MyDspaceItemStatusType;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * An object representing the duplicate match
   */
  @Input() metadataList: DuplicateMatchMetadataDetailConfig[] = [];

  /**
   * Represents the workflow of the item
   */
  @Input() workflowItem: WorkflowItem;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  dsoTitle: string;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.item);
  }


}
