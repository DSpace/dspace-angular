import { Component } from '@angular/core';

import { FieldRendetingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

/**
 * This component renders the longtext metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'div[ds-longtext]',
  templateUrl: './longtext.component.html',
  styleUrls: ['./longtext.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.LONGTEXT)
export class LongtextComponent extends RenderingTypeModel { }
