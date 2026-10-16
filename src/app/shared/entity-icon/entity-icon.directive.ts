import {
  Directive,
  ElementRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  AuthorityRefConfig,
  AuthorityRefEntityStyleConfig,
} from '@dspace/config/layout-config.interfaces';
import {
  isEmpty,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';

import { environment } from '../../../environments/environment';


/**
 * Directive to add to the element a entity icon based on metadata entity type and entity style
 */
@Directive({
  selector: '[dsEntityIcon]',
  standalone: true,
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
   * A configuration representing authorityRef values
   */
  confValue = environment.layout.authorityRef;

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
    const authorityRefConfig: AuthorityRefConfig = this.getAuthorityRefConfigByType(this.entityType);
    if (isNotEmpty(authorityRefConfig)) {
      const entityStyle: AuthorityRefEntityStyleConfig = this.getAuthorityRefEntityStyleConfig(authorityRefConfig, this.entityStyle);
      if (isNotEmpty(entityStyle)) {
        this.addIcon(entityStyle);
      }
    }
  }

  /**
   * Return the AuthorityRefConfig by the given type
   *
   * @param type
   * @private
   */
  private getAuthorityRefConfigByType(type: string): AuthorityRefConfig {
    let filteredConf: AuthorityRefConfig = this.confValue.find((config) => config.entityType.toUpperCase() === type.toUpperCase());
    if (isEmpty(filteredConf) && this.fallbackOnDefault) {
      filteredConf = this.confValue.find((config) => config.entityType.toUpperCase() === 'DEFAULT');
    }

    return filteredConf;
  }

  /**
   * Return the AuthorityRefEntityStyleConfig by the given style
   *
   * @param authorityConfig
   * @param styles
   * @private
   */
  private getAuthorityRefEntityStyleConfig(authorityConfig: AuthorityRefConfig, styles: string|string[]): AuthorityRefEntityStyleConfig {
    let filteredConf: AuthorityRefEntityStyleConfig;
    if (Array.isArray(styles)) {
      styles.forEach((style) => {
        if (Object.keys(authorityConfig.entityStyle).includes(style)) {
          filteredConf = authorityConfig.entityStyle[style];
        }
      });
    } else {
      filteredConf = authorityConfig.entityStyle[styles];
    }

    if (isEmpty(filteredConf) && this.fallbackOnDefault) {
      filteredConf = authorityConfig.entityStyle.default;
    }

    return filteredConf;
  }

  /**
   * Attach icon to HTML element
   *
   * @param entityStyle
   * @private
   */
  private addIcon(entityStyle: AuthorityRefEntityStyleConfig): void {
    const iconElement = `<i aria-hidden="true" class="${entityStyle.icon} ${entityStyle.style}"></i>`;
    if (this.iconPosition === 'after') {
      this.elem.nativeElement.insertAdjacentHTML('afterend', '&nbsp;' + iconElement);
    } else {
      this.elem.nativeElement.insertAdjacentHTML('beforebegin', iconElement + '&nbsp;');
    }
  }

}
