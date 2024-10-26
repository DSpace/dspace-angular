import { Component, OnInit } from '@angular/core';
import { editMetadataValueFieldComponent } from '../dso-edit-metadata-value-field-loader/dso-edit-metadata-value-field.decorator';
import { EditMetadataValueFieldType } from '../dso-edit-metadata-field-type.enum';
import { EntityTypeDataService } from '../../../../core/data/entity-type-data.service';
import { Observable } from 'rxjs';
import { getFirstSucceededRemoteListPayload } from '../../../../core/shared/operators';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { AbstractDsoEditMetadataValueFieldComponent } from '../abstract-dso-edit-metadata-value-field.component';

/**
 * The component used to gather input for entity-type metadata fields
 */
@Component({
  selector: 'ds-dso-edit-metadata-entity-field',
  templateUrl: './dso-edit-metadata-entity-field.component.html',
  styleUrls: ['./dso-edit-metadata-entity-field.component.scss'],
})
@editMetadataValueFieldComponent(EditMetadataValueFieldType.ENTITY_TYPE)
export class DsoEditMetadataEntityFieldComponent extends AbstractDsoEditMetadataValueFieldComponent implements OnInit {

  /**
   * List of all the existing entity types
   */
  entities$: Observable<ItemType[]>;

  constructor(
    protected entityTypeService: EntityTypeDataService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.entities$ = this.entityTypeService.findAll({ elementsPerPage: 100, currentPage: 1 }).pipe(
      getFirstSucceededRemoteListPayload(),
    );
  }

}
