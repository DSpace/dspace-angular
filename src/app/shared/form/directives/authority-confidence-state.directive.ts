/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import findIndex from 'lodash/findIndex';

import { ConfidenceIconConfig } from '../../../../config/submission-config.interface';
import { environment } from '../../../../environments/environment';
import { ConfidenceType } from '../../../core/shared/confidence-type';
import { MetadataValue } from '../../../core/shared/metadata.models';
import { VocabularyEntry } from '../../../core/submission/vocabularies/models/vocabulary-entry.model';
import { VocabularyEntryDetail } from '../../../core/submission/vocabularies/models/vocabulary-entry-detail.model';
import {
  isNotEmpty,
  isNull,
} from '../../empty.util';
import { FormFieldMetadataValueObject } from '../builder/models/form-field-metadata-value.model';

/**
 * Directive to add to the element a bootstrap utility class based on metadata confidence value
 */
@Directive({
  selector: '[dsAuthorityConfidenceState]',
  standalone: true,
})
export class AuthorityConfidenceStateDirective implements OnChanges, AfterViewInit {

  /**
   * The metadata value
   */
  @Input() authorityValue: VocabularyEntry | FormFieldMetadataValueObject | MetadataValue | string;

  /**
   * A boolean representing if to show html icon if authority value is empty
   */
  @Input() visibleWhenAuthorityEmpty = true;

  /**
   * A boolean to configure the display of icons instead of default style configuration
   * When true, the class configured in {@link ConfidenceIconConfig.icon} will be used, by default {@link ConfidenceIconConfig.style} is used
   */
  @Input() iconMode = false;

  /**
   * The css class applied before directive changes
   */
  private previousClass: string = null;

  /**
   * The css class applied after directive changes
   */
  private newClass: string;

  /**
   * An event fired when click on element that has a confidence value empty or different from CF_ACCEPTED
   */
  @Output() whenClickOnConfidenceNotAccepted: EventEmitter<ConfidenceType> = new EventEmitter<ConfidenceType>();

  /**
   * Listener to click event
   */
  @HostListener('click') onClick() {
    if (isNotEmpty(this.authorityValue) && this.getConfidenceByValue(this.authorityValue) !== ConfidenceType.CF_ACCEPTED) {
      this.whenClickOnConfidenceNotAccepted.emit(this.getConfidenceByValue(this.authorityValue));
    }
  }

  /**
   * Initialize instance variables
   *
   * @param {ElementRef} elem
   * @param {Renderer2} renderer
   */
  constructor(
    private elem: ElementRef,
    private renderer: Renderer2,
    private translate: TranslateService,
  ) {
  }

  /**
   * Apply css class to element whenever authority value change
   *
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.authorityValue.firstChange) {
      this.previousClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.previousValue));
    }
    this.newClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.currentValue));
    const confidenceName = this.getNameByConfidence(this.getConfidenceByValue(changes.authorityValue.currentValue));

    if (isNull(this.previousClass)) {
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
      if (this.iconMode) {
        this.renderer.setAttribute(this.elem.nativeElement, 'title', this.translate.instant(`confidence.indicator.help-text.${confidenceName}`));
      }
    } else if (this.previousClass !== this.newClass) {
      this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
      if (this.iconMode) {
        this.renderer.setAttribute(this.elem.nativeElement, 'title', this.translate.instant(`confidence.indicator.help-text.${confidenceName}`));
      }
    }
  }

  /**
   * Apply css class to element after view init
   */
  ngAfterViewInit() {
    if (isNull(this.previousClass)) {
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    } else if (this.previousClass !== this.newClass) {
      this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    }
  }

  /**
   * Return confidence value as ConfidenceType
   *
   * @param value
   */
  private getConfidenceByValue(value: any): ConfidenceType {
    let confidence: ConfidenceType = ConfidenceType.CF_UNSET;

    if (isNotEmpty(value) && (value instanceof VocabularyEntry || value instanceof VocabularyEntryDetail)
      && value.hasAuthority()) {
      confidence = ConfidenceType.CF_ACCEPTED;
    }

    if (isNotEmpty(value) && value instanceof FormFieldMetadataValueObject) {
      confidence = value.confidence;
    }

    if (isNotEmpty(value) && value instanceof MetadataValue) {
      confidence = value.confidence;
    }

    if (isNotEmpty(value) && Object.values(ConfidenceType).includes(value)) {
      confidence = value;
    }

    return confidence;
  }

  /**
   * Return the properly css class based on confidence value
   *
   * @param confidence
   */
  private getClassByConfidence(confidence: any): string {
    if (!this.visibleWhenAuthorityEmpty && confidence === ConfidenceType.CF_UNSET) {
      return 'd-none';
    }

    const confidenceIcons: ConfidenceIconConfig[] = environment.submission.icons.authority.confidence;

    const confidenceIndex: number = findIndex(confidenceIcons, { value: confidence });

    const defaultconfidenceIndex: number = findIndex(confidenceIcons, { value: 'default' as  any });

    if (this.iconMode) {
      const defaultClass: string = (defaultconfidenceIndex !== -1) ? confidenceIcons[defaultconfidenceIndex].icon : '';
      return (confidenceIndex !== -1) ? confidenceIcons[confidenceIndex].icon : defaultClass;
    } else {
      const defaultClass: string = (defaultconfidenceIndex !== -1) ? confidenceIcons[defaultconfidenceIndex].style : '';
      return (confidenceIndex !== -1) ? confidenceIcons[confidenceIndex].style : defaultClass;
    }
  }

  /**
   * Return the confidence value name
   *
   * @param confidence
   * @returns
   */
  private getNameByConfidence(confidence: any): string {
    const confidenceText = ConfidenceType[confidence];
    if (isNotEmpty(confidenceText)) {
      return confidenceText.replace('CF_', '').toLowerCase();
    } else {
      return 'unknown';
    }
  }

}
