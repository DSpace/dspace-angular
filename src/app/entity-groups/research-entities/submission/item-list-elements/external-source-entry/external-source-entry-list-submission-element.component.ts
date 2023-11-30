import { AbstractListableElementComponent } from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';
import { ExternalSourceEntry } from '../../../../../core/shared/external-source-entry.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { Context } from '../../../../../core/shared/context.model';
import { Component, OnInit } from '@angular/core';
import { Metadata } from '../../../../../core/shared/metadata.utils';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { getItemPageRoute } from '../../../../../item-page/item-page-routing-paths';
import { DuplicateMatchMetadataDetailConfig } from '../../../../../submission/sections/detect-duplicate/models/duplicate-detail-metadata.model';
import { environment } from '../../../../../../environments/environment';
import { Item } from '../../../../../core/shared/item.model';
import { PaginationComponentOptions } from '../../../../../shared/pagination/pagination-component-options.model';

@listableObjectComponent(ExternalSourceEntry, ViewMode.ListElement, Context.EntitySearchModal)
@listableObjectComponent(ExternalSourceEntry, ViewMode.ListElement, Context.EntitySearchModalWithNameVariants)
@Component({
  selector: 'ds-external-source-entry-list-submission-element',
  styleUrls: ['./external-source-entry-list-submission-element.component.scss'],
  templateUrl: './external-source-entry-list-submission-element.component.html'
})
/**
 * The component for displaying a list element of an external source entry
 */
export class ExternalSourceEntryListSubmissionElementComponent extends AbstractListableElementComponent<ExternalSourceEntry> implements OnInit {
  /**
   * The metadata value for the object's uri
   */
  uri: MetadataValue;

  /**
   * The metadata value for issue date
   */
  issued: MetadataValue;

  /**
   * The metadata value for abstract
   */
  abstract: MetadataValue;

  /**
   * The metadata value for contributors
   */
  contributors: MetadataValue[];

  /**
   * The metadata value for identifiers
   */
  identifiers: MetadataValue[];

 /**
   * The search result object.
   * @type {object}
   */
  itemPreviewObject = { hitHighlights: [] };

  /**
 * The list of the metadata, of the possible duplication, to show in HTML.
 * @type {DuplicateMatchMetadataDetailConfig}
 */
  metadataList: DuplicateMatchMetadataDetailConfig[];

  /**
   * Boolean value indicating whether the external source entry matchObjects section is collapsed or not.
   */
  isCollapsed = true;

  /**
   * The item page route
   */
  itemPageRoute: string;

  /**
    * The current pagination configuration for the page
    */
  pageConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'sobm',
    pageSize: 2,
    currentPage: 1,
  });

  ngOnInit(): void {
    this.uri = Metadata.first(this.object.metadata, 'dc.identifier.uri');
    this.issued = Metadata.first(this.object.metadata, 'dc.date.issued');
    this.abstract = Metadata.first(this.object.metadata, 'dc.description.abstract');
    this.contributors = Metadata.all(this.object.metadata, 'dc.contributor.*');
    this.identifiers = Metadata.all(this.object.metadata, 'dc.identifier.*');
    this.metadataList = environment.submission.detectDuplicate.metadataDetailsList || [];
  }

  /**
   * Returns the route for the given item.
   * @param item The item to get the route for.
   * @returns The route for the given item.
   */
  getItemRoute(item: Item): string {
    if (item) {
      return getItemPageRoute(item);
    }
  }
}
