import {
  Directive,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[dsBtnDisabled]',
  standalone: true,
})

/**
 * This directive can be added to a html element to disable it (make it non-interactive).
 * It acts as a replacement for HTML's disabled attribute.
 *
 * This directive should always be used instead of the HTML disabled attribute as it is more accessible.
 */
export class BtnDisabledDirective {

    @Input() set dsBtnDisabled(value: boolean) {
    this.isDisabled = !!value;
  }

    /**
     * Binds the aria-disabled attribute to the directive's isDisabled property.
     * This is used to make the element accessible to screen readers. If the element is disabled, the screen reader will announce it as such.
     */
    @HostBinding('attr.aria-disabled') isDisabled = false;

    /**
     * Binds the class attribute to the directive's isDisabled property.
     * This is used to style the element when it is disabled (make it look disabled).
     */
    @HostBinding('class.disabled') get disabledClass() { return this.isDisabled; }

    /**
     * Prevents the default action and stops the event from propagating when the element is disabled.
     * This is used to prevent the element from being interacted with when it is disabled (via mouse click).
     * @param event The click event.
     */
    @HostListener('click', ['$event'])
    handleClick(event: Event) {
      if (this.isDisabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }

    /**
     * Prevents the default action and stops the event from propagating when the element is disabled.
     * This is used to prevent the element from being interacted with when it is disabled (via keystrokes).
     * @param event The keydown event.
     */
  @HostListener('keydown', ['$event'])
    handleKeydown(event: KeyboardEvent) {
      if (this.isDisabled && (event.key === 'Enter' || event.key === 'Space')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    }
}

