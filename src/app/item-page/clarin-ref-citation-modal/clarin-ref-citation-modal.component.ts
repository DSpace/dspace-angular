import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * The modal component for copying the citation data retrieved from OAI-PMH.
 */
@Component({
  selector: 'ds-clarin-ref-citation-modal',
  templateUrl: './clarin-ref-citation-modal.component.html',
  styleUrls: ['./clarin-ref-citation-modal.component.scss']
})
export class ClarinRefCitationModalComponent implements AfterViewInit {

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
   * The type of the citation - e.g. `bibtex` or `cmdi`
   */
  @Input()
  citationType = '';

  /**
   * The citation context - data retrieved from OAI-PMH
   */
  @Input()
  citationText = '';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.selectContent();
    }, 100);
  }

  selectContent() {
    this.citationContentRef?.nativeElement?.select();
  }
}
