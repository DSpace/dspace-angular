import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyEntryDetail } from '../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';

@Component({
  selector: 'ds-vocabulary-treeview-modal',
  templateUrl: './vocabulary-treeview-modal.component.html',
  styleUrls: ['./vocabulary-treeview-modal.component.scss']
})
/**
 * Component that contains a modal to display a VocabularyTreeviewComponent
 */
export class VocabularyTreeviewModalComponent {

  /**
   * The {@link VocabularyOptions} object
   */
  @Input() vocabularyOptions: VocabularyOptions;

  /**
   * Representing how many tree level load at initialization
   */
  @Input() preloadLevel = 2;

  /**
   * The vocabulary entries already selected, if any
   */
  @Input() selectedItems: string[] = [];

  /**
   * Whether to allow selecting multiple values with checkboxes
   */
  @Input() multiSelect = false;

  /**
   * Initialize instance variables
   *
   * @param {NgbActiveModal} activeModal
   */
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  /**
   * Method called on entry select
   */
  onSelect(item: VocabularyEntryDetail) {
    this.activeModal.close(item);
  }
}
