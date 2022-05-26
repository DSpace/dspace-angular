import { Component } from '@angular/core';
import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeValueModelComponent } from '../rendering-type-value.model';

/**
 * This component renders the crisref metadata fields
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-crisref]',
  templateUrl: './crisref.component.html',
  styleUrls: ['./crisref.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.CRISREF)
export class CrisrefComponent extends RenderingTypeValueModelComponent {

}
