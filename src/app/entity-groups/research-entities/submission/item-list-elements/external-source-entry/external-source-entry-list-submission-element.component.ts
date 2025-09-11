import { Component, OnInit } from '@angular/core';
import { Context, ExternalSourceEntry, MetadataValue, Metadata, ViewMode } from '@dspace/core'

import {
  listableObjectComponent,
} from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import {
  AbstractListableElementComponent,
} from '../../../../../shared/object-collection/shared/object-collection-element/abstract-listable-element.component';

@listableObjectComponent(ExternalSourceEntry, ViewMode.ListElement, Context.EntitySearchModal)
@listableObjectComponent(ExternalSourceEntry, ViewMode.ListElement, Context.EntitySearchModalWithNameVariants)
@Component({
  selector: 'ds-external-source-entry-list-submission-element',
  styleUrls: ['./external-source-entry-list-submission-element.component.scss'],
  templateUrl: './external-source-entry-list-submission-element.component.html',
  standalone: true,
  imports: [],
})
/**
 * The component for displaying a list element of an external source entry
 */
export class ExternalSourceEntryListSubmissionElementComponent extends AbstractListableElementComponent<ExternalSourceEntry> implements OnInit {
  /**
   * The metadata value for the object's uri
   */
  uri: MetadataValue;

  ngOnInit(): void {
    this.uri = Metadata.first(this.object.metadata, 'dc.identifier.uri');
  }
}
