import { AfterViewInit, Input } from '@angular/core';
import { SectionDataObject } from './section-data.model';
import { JsonPatchOperationsBuilder } from '../../core/json-patch/builder/json-patch-operations-builder';
import { Store } from '@ngrx/store';
import { CoreState } from '../../core/core.reducers';

export interface SectionDataModel {
  sectionData: SectionDataObject
}

/**
 * An abstract model class for a submission edit form section.
 */
export abstract class SectionModelComponent implements SectionDataModel {
  @Input() sectionData: SectionDataObject;

  protected abstract operationsState: Store<CoreState>;
  protected abstract operationsBuilder: JsonPatchOperationsBuilder;

}
