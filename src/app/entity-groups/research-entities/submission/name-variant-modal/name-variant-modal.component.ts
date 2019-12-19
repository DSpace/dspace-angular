import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-name-variant-modal',
  templateUrl: './name-variant-modal.component.html',
  styleUrls: ['./name-variant-modal.component.scss']
})
/**
 * The component for the modal to add a name variant to an item
 */
export class NameVariantModalComponent {
  /**
   * The name variant
   */
  @Input() value: string;

  constructor(public modal: NgbActiveModal) {
  }
}
