import { Component, EventEmitter, Input, Output } from '@angular/core';
import { isNotEmpty } from '../../../../shared/empty.util';
import { Metadatum } from '../../../../core/shared/metadatum.model';
import { RegistryService } from '../../../../core/registry/registry.service';

@Component({
  selector: 'ds-edit-in-place-field.',
  styleUrls: ['./edit-in-place-field.component.scss'],
  templateUrl: './edit-in-place-field.component.html',
})
/**
 * Component for displaying an item's status
 */
export class EditInPlaceComponent {

  /**
   * The value to display
   */
  @Input() metadata: Metadatum;
  @Output() mdUpdate: EventEmitter<any> = new EventEmitter();
  @Output() mdRemove: EventEmitter<any> = new EventEmitter();
  editable = false;

  constructor(
    private metadataFieldService: RegistryService,
  ) {

  }

  isNotEmpty(value) {
    return isNotEmpty(value);
  }

  update() {
    this.mdUpdate.emit();
  }

  remove() {
    this.mdRemove.emit()
  }
}
