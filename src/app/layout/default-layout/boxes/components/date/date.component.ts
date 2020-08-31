import { Component } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

/**
 * This component renders the date metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-date].container',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.DATE)
export class DateComponent extends RenderingTypeModel {
}
