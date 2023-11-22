import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

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
export class VocabularyTreeviewModalComponent implements OnInit {

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
  @Input() selectedItems: VocabularyEntryDetail[] = [];

  /**
   * Whether to allow selecting multiple values with checkboxes
   */
  @Input() multiSelect = false;

  /**
   * Contain a descriptive message for this vocabulary retrieved from i18n files
   */
  description: string;

  /**
   * Initialize instance variables
   *
   * @param {NgbActiveModal} activeModal
   * @param {TranslateService} translate
   */
  constructor(
    public activeModal: NgbActiveModal,
    protected translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.setDescription();
  }

  /**
   * Method called on entry select
   */
  onSelect(item: VocabularyEntryDetail) {
    this.activeModal.close(item);
  }

  /**
   * Set the description message related to the given vocabulary
   */
  private setDescription() {
    const descriptionLabel = 'vocabulary-treeview.tree.description.' + this.vocabularyOptions.name;
    this.description = this.translate.instant(descriptionLabel);
  }

}
