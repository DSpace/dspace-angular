import { Directive, Input, HostBinding, HostListener } from '@angular/core';

@Directive({
    selector: '[dsDisabled]'
})
export class DisabledDirective {

    @Input() set dsDisabled(value: boolean) {
        this.isDisabled = value;
    }

    @HostBinding('attr.aria-disabled') isDisabled = false;
    @HostBinding('class.disabled') get disabledClass() { return this.isDisabled; }

    @HostListener('click', ['$event'])
    handleClick(event: Event) {
        if (this.isDisabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    @HostListener('keydown', ['$event'])
    handleKeydown(event: KeyboardEvent) {
        if (this.isDisabled && (event.key === 'Enter' || event.key === 'Space')) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }
}

