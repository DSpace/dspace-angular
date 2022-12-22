import { Directive, ElementRef, Input, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { CrisRefConfig, CrisRefEntityStyleConfig } from '../../../config/layout-config.interfaces';
import { isEmpty, isNotEmpty } from '../empty.util';

/**
 * Directive to add to the element a entity icon based on metadata entity type and entity style
 */
@Directive({
  selector: '[dsEntityIcon]'
})
export class EntityIconDirective implements OnInit {

  /**
   * The metadata entity type
   */
  @Input() entityType = 'default';

  /**
   * The metadata entity style
   */
  @Input() entityStyle: string|string[] = 'default';

  /**
   * A boolean representing if to fallback on default style if the given one is not found
   */
  @Input() fallbackOnDefault = true;

  /**
   * A boolean representing if to show html icon before or after
   */
  @Input() iconPosition = 'after';

  /**
   * A configuration representing crisRef values
   */
  confValue = environment.crisLayout.crisRef;

  /**
   * Initialize instance variables
   *
   * @param {ElementRef} elem
   */
  constructor(private elem: ElementRef) {
  }

  /**
   * Adding icon to element oninit
   */
  ngOnInit() {
    const crisRefConfig: CrisRefConfig = this.getCrisRefConfigByType(this.entityType);
    if (isNotEmpty(crisRefConfig)) {
      const crisStyle: CrisRefEntityStyleConfig = this.getCrisRefEntityStyleConfig(crisRefConfig, this.entityStyle);
      if (isNotEmpty(crisStyle)) {
        this.addIcon(crisStyle);
      }
    }
  }

  /**
   * Return the CrisRefConfig by the given type
   *
   * @param type
   * @private
   */
  private getCrisRefConfigByType(type: string): CrisRefConfig {
    let filteredConf: CrisRefConfig = this.confValue.find((config) => config.entityType.toUpperCase() === type.toUpperCase());
    if (isEmpty(filteredConf) && this.fallbackOnDefault) {
      filteredConf = this.confValue.find((config) => config.entityType.toUpperCase() === 'DEFAULT');
    }

    return filteredConf;
  }

  /**
   * Return the CrisRefEntityStyleConfig by the given style
   *
   * @param crisConfig
   * @param styles
   * @private
   */
  private getCrisRefEntityStyleConfig(crisConfig: CrisRefConfig, styles: string|string[]): CrisRefEntityStyleConfig {
    let filteredConf: CrisRefEntityStyleConfig;
    if (Array.isArray(styles)) {
      styles.forEach((style) => {
        if (Object.keys(crisConfig.entityStyle).includes(style)) {
          filteredConf = crisConfig.entityStyle[style];
        }
      });
    } else {
      filteredConf = crisConfig.entityStyle[styles];
    }

    if (isEmpty(filteredConf) && this.fallbackOnDefault) {
      filteredConf = crisConfig.entityStyle.default;
    }

    return filteredConf;
  }

  /**
   * Attach icon to HTML element
   *
   * @param crisStyle
   * @private
   */
  private addIcon(crisStyle: CrisRefEntityStyleConfig): void {
    const iconElement = `<i class="${crisStyle.icon} ${crisStyle.style}"></i>`;
    if (this.iconPosition === 'after') {
      this.elem.nativeElement.insertAdjacentHTML('afterend', '&nbsp;' + iconElement);
    } else {
      this.elem.nativeElement.insertAdjacentHTML('beforebegin', iconElement + '&nbsp;');
    }
  }

}
