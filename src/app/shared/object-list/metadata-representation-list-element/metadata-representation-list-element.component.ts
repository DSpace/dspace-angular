import {
  Component,
  Input,
} from '@angular/core';

import { BrowseByDataType } from '../../../browse-by/browse-by-switcher/browse-by-data-type';
import { Context } from '../../../core/shared/context.model';
import { VIRTUAL_METADATA_PREFIX } from '../../../core/shared/metadata.models';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';
import { hasValue } from '../../empty.util';

@Component({
  selector: 'ds-metadata-representation-list-element',
  template: '',
  standalone: true,
})
/**
 * An abstract class for displaying a single MetadataRepresentation
 */
export class MetadataRepresentationListElementComponent {

  /**
   * The optional context
   */
  @Input() context: Context;

  /**
   * The metadata representation of this component
   */
  @Input() mdRepresentation: MetadataRepresentation;

  /**
   * Returns true if this component's value matches a basic regex "Is this an HTTP URL" test
   */
  isLink(): boolean {
    // Match any string that begins with http:// or https://
    const linkPattern = new RegExp(/^https?:\/\/.*/);
    return linkPattern.test(this.mdRepresentation.getValue());
  }

  /**
   * Get the appropriate query parameters for this browse link, depending on whether the browse definition
   * expects 'startsWith' (eg browse by date) or 'value' (eg browse by title)
   */
  getQueryParams() {
    const queryParams = { startsWith: this.mdRepresentation.getValue() };
    // todo: should compare with type instead?
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (this.mdRepresentation.browseDefinition.getRenderType() === BrowseByDataType.Metadata) {
      if (hasValue(this.mdRepresentation.getAuthority()) && !this.isVirtual(this.mdRepresentation)) {
        return { value: this.mdRepresentation.getValue(), authority: this.mdRepresentation.getAuthority() };
      } else {
        return { value: this.mdRepresentation.getValue() };
      }
    }
    return queryParams;
  }

  private isVirtual(metadataRepresentation: MetadataRepresentation | undefined): boolean {
    return hasValue(metadataRepresentation?.getAuthority()) && metadataRepresentation.getAuthority()
      .startsWith(VIRTUAL_METADATA_PREFIX);
  }

}
