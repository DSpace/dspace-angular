import {
  Directive,
  ElementRef, EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';

import { findIndex } from 'lodash';

import { AuthorityValue } from '../../core/integration/models/authority.value';
import { FormFieldMetadataValueObject } from '../form/builder/models/form-field-metadata-value.model';
import { ConfidenceType } from '../../core/integration/models/confidence-type';
import { isNotEmpty, isNull } from '../empty.util';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { ConfidenceIconConfig } from '../../../config/submission-config.interface';

@Directive({
  selector: '[dsAuthorityConfidenceState]'
})
export class AuthorityConfidenceStateDirective implements OnChanges {

  @Input() authorityValue: AuthorityValue | FormFieldMetadataValueObject | string;
  @Input() visibleWhenAuthorityEmpty = true;

  private previousClass: string = null;
  private newClass: string;

  @Output() whenClickOnConfidenceNotAccepted: EventEmitter<ConfidenceType> = new EventEmitter<ConfidenceType>();

  @HostListener('click') onClick() {
    if (isNotEmpty(this.authorityValue) && this.getConfidenceByValue(this.authorityValue) !== ConfidenceType.CF_ACCEPTED) {
      this.whenClickOnConfidenceNotAccepted.emit(this.getConfidenceByValue(this.authorityValue));
    }
  }

  constructor(
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig,
    private elem: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.authorityValue.firstChange) {
      this.previousClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.previousValue))
    }
    this.newClass = this.getClassByConfidence(this.getConfidenceByValue(changes.authorityValue.currentValue));

    if (isNull(this.previousClass)) {
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    } else if (this.previousClass !== this.newClass) {
      this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    }
  }

  ngAfterViewInit() {
    if (isNull(this.previousClass)) {
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    } else if (this.previousClass !== this.newClass) {
      this.renderer.removeClass(this.elem.nativeElement, this.previousClass);
      this.renderer.addClass(this.elem.nativeElement, this.newClass);
    }
  }

  private getConfidenceByValue(value: any): ConfidenceType {
    let confidence: ConfidenceType = ConfidenceType.CF_UNSET;

    if (isNotEmpty(value) && value instanceof AuthorityValue && value.hasAuthority()) {
      confidence = ConfidenceType.CF_ACCEPTED;
    }

    if (isNotEmpty(value) && value instanceof FormFieldMetadataValueObject) {
      confidence = value.confidence;
    }

    return confidence;
  }

  private getClassByConfidence(confidence: any): string {
    if (!this.visibleWhenAuthorityEmpty && confidence === ConfidenceType.CF_UNSET) {
      return 'd-none';
    }

    const confidenceIcons: ConfidenceIconConfig[] = this.EnvConfig.submission.icons.authority.confidence;

    const confidenceIndex: number = findIndex(confidenceIcons, {value: confidence});

    const defaultconfidenceIndex: number = findIndex(confidenceIcons, {value: 'default' as  any});
    const defaultClass: string = (defaultconfidenceIndex !== -1) ? confidenceIcons[defaultconfidenceIndex].style : '';

    return (confidenceIndex !== -1) ? confidenceIcons[confidenceIndex].style : defaultClass;
  }

}
