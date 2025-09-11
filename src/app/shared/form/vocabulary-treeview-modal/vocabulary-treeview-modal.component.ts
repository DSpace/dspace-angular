import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { VocabularyEntryDetail } from '../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyTreeviewComponent } from '../vocabulary-treeview/vocabulary-treeview.component';

@Component({
  selector: 'ds-vocabulary-treeview-modal',
  templateUrl: './vocabulary-treeview-modal.component.html',
  styleUrls: ['./vocabulary-treeview-modal.component.scss'],
  imports: [
    TranslateModule,
    VocabularyTreeviewComponent,
  ],
  standalone: true,
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
   * A boolean representing if to show the add button or not
   */
  @Input() showAdd = true;

  /**
   * Contain a descriptive message for this vocabulary retrieved from i18n files
   */
  description: string;

  /**
   * An event fired when a vocabulary entry is selected.
   * Event's payload equals to {@link VocabularyEntryDetail} selected.
   */
  @Output() select: EventEmitter<VocabularyEntryDetail> = new EventEmitter<VocabularyEntryDetail>(null);

  /**
   * Initialize instance variables
   *
   * @param {NgbActiveModal} activeModal
   * @param {TranslateService} translate
   */
  constructor(
    public activeModal: NgbActiveModal,
    protected translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.setDescription();
  }

  /**
   * Method called on entry select
   */
  onSelect(item: VocabularyEntryDetail) {
    this.select.emit(item);
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
