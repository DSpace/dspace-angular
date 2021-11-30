import { CrisLayoutPageModelComponent } from './cris-layout-page-component.model';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CrisLayoutBox } from '../../core/layout/models/box.model';
import { TranslateService } from '@ngx-translate/core';
import { Item } from '../../core/shared/item.model';
import { hasValue, isEmpty } from '../../shared/empty.util';

/**
 * This class is a model to be extended for creating custom layouts for boxes
 */
@Component({
  template: ''
})
export abstract class CrisLayoutBoxModelComponent extends CrisLayoutPageModelComponent implements OnInit {

  /**
   * CrisLayoutBox.
   */
  @Input() box: CrisLayoutBox;

  /**
   * Emit a refresh box request from within the CrisLayoutBox.
   */
  @Output() refreshBox: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Emit a refresh tab request from within the CrisLayoutBox.
   */
  @Output() refreshTab: EventEmitter<void> = new EventEmitter<void>();

  activeIds: string[] = [];

  /**
   * The prefix used for box header's i18n key
   */
  boxI18nPrefix = 'layout.box.header.';

  /**
   * The i18n key used for box's header
   */
  boxHeaderI18nKey = '';

  protected constructor(
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
    ) {
    super();
    this.box = boxProvider;
    this.item = itemProvider;
  }

  /**
   * Check if the current box is collapsed or not
   */
  ngOnInit(): void {
    this.boxHeaderI18nKey = this.boxI18nPrefix + this.box.shortname;

    if (!hasValue(this.box.collapsed) || !this.box.collapsed) {
      this.activeIds.push(this.box.shortname);
    }

  }

  /**
   * Get box header to be inserted inside the accordion
   */
  getBoxHeader(): string {
    const header: string = isEmpty(this.boxHeaderI18nKey) ? null : this.translateService.instant(this.boxHeaderI18nKey);
    if (isEmpty(header) || header === this.boxHeaderI18nKey) {
      // if translation does not exist return the value present in the header property
      return this.translateService.instant(this.box.header);
    } else {
      return header;
    }
  }
}
