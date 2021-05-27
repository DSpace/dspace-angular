import { Component } from '@angular/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModelComponent } from '../rendering-type.model';

/**
 * This component renders the text metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-orcid]',
  templateUrl: './orcid.component.html',
  styleUrls: ['./orcid.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ORCID)
export class OrcidComponent extends RenderingTypeModelComponent {

  public hasOrcid(): boolean {
    return this.item.hasMetadata('person.identifier.orcid');
  }

  public hasOrcidBadge(): boolean {
    return this.item.hasMetadata('cris.orcid.authenticated');
  }

}
