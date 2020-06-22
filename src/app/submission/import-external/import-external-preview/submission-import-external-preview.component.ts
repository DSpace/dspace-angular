import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExternalSourceEntry } from '../../../core/shared/external-source-entry.model';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { Metadata } from '../../../core/shared/metadata.utils';

/**
 * This component display a preview of an external source item.
 */
@Component({
  selector: 'ds-submission-import-external-preview',
  styleUrls: ['./submission-import-external-preview.component.scss'],
  templateUrl: './submission-import-external-preview.component.html'
})
export class SubmissionImportExternalPreviewComponent implements OnInit {
  /**
   * The external source entry
   */
  public externalSourceEntry: ExternalSourceEntry;
  /**
   * The entry metadata list
   */
  public metadataList: Array<{ key: string, value: MetadataValue }>;
  /**
   * The modal for the entry preview
   */
  modalRef: NgbModalRef;

  /**
   * Initialize the component variables.
   * @param {NgbActiveModal} activeModal
   */
  constructor(
    private activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) { }

  /**
   * Metadata initialization for HTML display.
   */
  ngOnInit(): void {
    this.metadataList = [];
    const metadataKeys = Object.keys(this.externalSourceEntry.metadata);
    metadataKeys.forEach((key) => {
      this.metadataList.push({
        key: key,
        value: Metadata.first(this.externalSourceEntry.metadata, key)
      });
    })
  }

  /**
   * Closes the modal.
   */
  public closeMetadataModal(): void {
    this.activeModal.dismiss(false);
  }

  /**
   * Start the import of an entry by opening up an import modal window.
   * @param entry The entry to import
   */
  public import(entry): void {
    this.modalRef = this.modalService.open(SubmissionImportExternalPreviewComponent, {
      size: 'lg',
    });
    const modalComp = this.modalRef.componentInstance;
    modalComp.externalSourceEntry = entry;
  }
}
