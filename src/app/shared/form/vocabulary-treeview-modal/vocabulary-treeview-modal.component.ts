import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';

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
   * The vocabulary entry already selected, if any
   */
  @Input() selectedItem: any = null;

  /**
   * Initialize instance variables
   *
   * @param {NgbActiveModal} activeModal
   */
  constructor(
    public activeModal: NgbActiveModal,
  ) { }
}
