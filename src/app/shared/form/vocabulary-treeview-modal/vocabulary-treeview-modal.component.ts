import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { VocabularyEntryDetail } from '../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyTreeviewComponent } from '../vocabulary-treeview/vocabulary-treeview.component';

@Component({
  selector: 'ds-vocabulary-treeview-modal',
  templateUrl: './vocabulary-treeview-modal.component.html',
  styleUrls: ['./vocabulary-treeview-modal.component.scss'],
  imports: [
    VocabularyTreeviewComponent,
    TranslateModule,
  ],
  standalone: true,
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
   * An event fired when a vocabulary entry is selected.
   * Event's payload equals to {@link VocabularyEntryDetail} selected.
   */
  @Output() select: EventEmitter<VocabularyEntryDetail> = new EventEmitter<VocabularyEntryDetail>(null);

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
    this.select.emit(item);
    this.activeModal.close(item);
  }
}
