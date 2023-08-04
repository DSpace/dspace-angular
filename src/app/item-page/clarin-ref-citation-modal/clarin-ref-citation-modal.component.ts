import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * The modal component for copying the citation data retrieved from OAI-PMH.
 */
@Component({
  selector: 'ds-clarin-ref-citation-modal',
  templateUrl: './clarin-ref-citation-modal.component.html',
  styleUrls: ['./clarin-ref-citation-modal.component.scss']
})
export class ClarinRefCitationModalComponent {

  constructor(public activeModal: NgbActiveModal) {
  }

  /**
   * The reference to make possible automatically select whole content.
   */
  @ViewChild('copyCitationModal', { static: true }) citationContentRef: ElementRef;

  /**
   * The name of the showed Item
   */
  @Input()
  itemName = '';

  /**
   * The citation context - data retrieved from OAI-PMH
   */
  @Input()
  citationText = '';

  selectContent() {
    this.citationContentRef?.nativeElement?.select();
  }
}
