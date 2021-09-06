import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-item-version-summary-modal',
  templateUrl: './item-version-summary-modal.component.html',
  styleUrls: ['./item-version-summary-modal.component.scss']
})
export class ItemVersionSummaryModalComponent implements OnInit {

  constructor(protected activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }
}
