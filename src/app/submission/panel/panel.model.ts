import { Input } from '@angular/core';
import { PanelDataObject } from './panel-data.model';

export interface PanelDataModel {
  sectionData: PanelDataObject
}

/**
 * An abstract model class for a submission edit form panel.
 */
export class PanelModelComponent implements PanelDataModel {
  @Input() sectionData: PanelDataObject;
}
