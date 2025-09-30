import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import intersectionWith from 'lodash/intersectionWith';
import { Observable } from 'rxjs';
import {
  filter,
  mergeAll,
  take,
} from 'rxjs/operators';

import { BrowseService } from '../../../../core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../../core/browse/browse-definition-data.service';
import { BrowseDefinition } from '../../../../core/shared/browse-definition.model';
import { Item } from '../../../../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getPaginatedListPayload,
  getRemoteDataPayload,
} from '../../../../core/shared/operators';
import { MetadataValuesComponent } from '../../../field-components/metadata-values/metadata-values.component';
import { ImageField } from './image-field';

/**
 * This component can be used to represent metadata on a simple item page.
 * It expects one input parameter of type Item to which the metadata belongs.
 * This class can be extended to print certain metadata.
 */

@Component({
  templateUrl: './item-page-field.component.html',
  imports: [
    AsyncPipe,
    MetadataValuesComponent,
  ],
  standalone: true,
})
export class ItemPageFieldComponent {

  constructor(protected browseDefinitionDataService: BrowseDefinitionDataService,
              protected browseService: BrowseService) {
  }

    /**
     * The item to display metadata for
     */
    @Input() item: Item;

    /**
     * Whether the {@link MarkdownDirective} should be used to render this metadata.
     */
    enableMarkdown = false;

    /**
     * Fields (schema.element.qualifier) used to render their values.
     */
    fields: string[];

    /**
     * Label i18n key for the rendered metadata
     */
    label: string;

    /**
     * Separator string between multiple values of the metadata fields defined
     * @type {string}
     */
    separator = '<br/>';

    /**
     * Whether any valid HTTP(S) URL should be rendered as a link
     */
    urlRegex?: string;

    /**
     * Image Configuration
     */
    img: ImageField;

    /**
     * Return browse definition that matches any field used in this component if it is configured as a browse
     * link in dspace.cfg (webui.browse.link.<n>)
     */
    get browseDefinition(): Observable<BrowseDefinition> {
      return this.browseService.getBrowseDefinitions().pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        getPaginatedListPayload(),
        mergeAll(),
        filter((def: BrowseDefinition) =>
          intersectionWith(def.metadataKeys, this.fields, ItemPageFieldComponent.fieldMatch).length > 0,
        ),
        take(1),
      );
    }

    /**
     * Returns true iff the spec and field match.
     * @param spec  Specification of a metadata field name: either a metadata field, or a prefix ending in ".*".
     * @param field A metadata field name.
     * @private
     */
    private static fieldMatch(spec: string, field: string): boolean {
      return field === spec
        || (spec.endsWith('.*') && field.substring(0, spec.length - 1) === spec.substring(0, spec.length - 1));
    }
}
