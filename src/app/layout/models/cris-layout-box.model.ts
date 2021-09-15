import { CrisLayoutPageModelComponent } from './cris-layout-page.model';
import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Box } from '../../core/layout/models/box.model';
import { hasValue } from '../../shared/empty.util';
import { TranslateService } from '@ngx-translate/core';

/**
 * This class is a model to be extended for creating custom layouts for boxes
 */
@Component({
  template: ''
})
export abstract class CrisLayoutBoxModelComponent extends CrisLayoutPageModelComponent implements OnInit {

  /**
   * Box.
   */
  @Input() box: Box;

  /**
   * Emit a refresh box request from within the Box.
   */
  @Output() refreshBox: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Emit a refresh tab request from within the Box.
   */
  @Output() refreshTab: EventEmitter<void> = new EventEmitter<void>();

  /**
   * The prefix used for box header's i18n key
   */
  boxI18nPrefix = 'layout.box.header.';

  /**
   * The i18n key used for box's header
   */
  boxHeaderI18nKey = '';

  activeIds: string[] = [];

  random = Math.floor(Math.random() * 10000000);

  /**
   * Variable to understand if the next box clear value
   */
  nextBoxClear = true;

  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.flex') flex = '1';
  /**
   * Dynamic styling of the component host selector
   */
  @HostBinding('style.marginRight') marginRight = '0px';

  protected constructor(protected translateService: TranslateService, protected viewRef: ElementRef) {
    super();
  }

  /**
   * Check if the current box is collapsed or not
   */
  ngOnInit(): void {
    this.boxHeaderI18nKey = this.boxI18nPrefix + this.box.shortname;

    if (!hasValue(this.box.collapsed) || !this.box.collapsed) {
      this.activeIds.push(this.box.shortname);
    }

    if ((this.box.clear && !this.nextBoxClear) || (!this.box.clear && !this.nextBoxClear)) {
      this.marginRight = '1rem';
    }
  }

  ngAfterViewInit() {
    // If clear box is true means that box should be renderend in a new line, so adding a breaking flex line div
    if (this.box.clear) {
      this.viewRef.nativeElement.insertAdjacentHTML('beforebegin', '<div style="flex-basis: 100%;"></div>');
    }
  }

  getBoxHeader(): string {
    const header: string = this.translateService.instant(this.boxHeaderI18nKey);
    if (header === this.boxHeaderI18nKey ) {
      // if translation does not exist return the value present in the header property
      return this.translateService.instant(this.box.header);
    } else {
      return header;
    }
  }
}
