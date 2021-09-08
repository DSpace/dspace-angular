import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-item-versions-summary-modal',
  templateUrl: './item-versions-summary-modal.component.html',
  styleUrls: ['./item-versions-summary-modal.component.scss']
})
export class ItemVersionsSummaryModalComponent implements OnInit {

  constructor(
    protected activeModal: NgbActiveModal,) { }

  closeModal() {
    this.activeModal.close();
  }
  ngOnInit(): void {
  }

}
