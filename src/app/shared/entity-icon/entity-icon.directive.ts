import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CrisRefEntityStyleConfig } from 'src/config/layout-config.interfaces';

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
  @Input() entityStyle = 'default';

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
  constructor( private elem: ElementRef ) { }

  /**
   * Adding icon to element oninit
   */
  ngOnInit() {
    const filteredEntity = this.confValue.find((config) => config.entityType.toUpperCase() === this.entityType.toUpperCase()) ??
                           this.confValue.find((config) => config.entityType.toUpperCase() === 'DEFAULT');
    this.confValue.find((config) => config.entityType.toUpperCase() === this.entityType.toUpperCase());
    const iconStyle: CrisRefEntityStyleConfig = filteredEntity.entityStyle[this.entityStyle] ?? filteredEntity.entityStyle.default;
    const iconElement = `<i class="${iconStyle.icon} ${iconStyle.style}"></i>`;
    if (this.iconPosition === 'after') {
      this.elem.nativeElement.insertAdjacentHTML('afterend', '&nbsp;' + iconElement);
    } else {
      this.elem.nativeElement.insertAdjacentHTML('beforebegin', iconElement + '&nbsp;');
    }
  }

}
