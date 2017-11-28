import { Input } from '@angular/core';
import { SectionDataObject } from './section-data.model';

export interface SectionDataModel {
  sectionData: SectionDataObject
}

/**
 * An abstract model class for a submission edit form section.
 */
export abstract class SectionModelComponent implements SectionDataModel {
  @Input() sectionData: SectionDataObject;

}
