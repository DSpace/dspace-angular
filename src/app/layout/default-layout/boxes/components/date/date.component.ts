import { Component } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';

/**
 * This component renders the date metadata fields
 */
@Component({
  selector: 'ds-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.DATE)
export class DateComponent extends RenderingTypeModel {
}
