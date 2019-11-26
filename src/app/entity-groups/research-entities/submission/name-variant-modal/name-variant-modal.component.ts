import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-name-variant-modal',
  templateUrl: './name-variant-modal.component.html',
  styleUrls: ['./name-variant-modal.component.scss']
})
export class NameVariantModalComponent {
  @Input() value: string;

  constructor(public modal: NgbActiveModal) {
  }
}
