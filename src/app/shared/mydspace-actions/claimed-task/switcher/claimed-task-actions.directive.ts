import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dsClaimedTaskActions]',
    standalone: true
})
/**
 * Directive used as a hook to know where to inject the dynamic Claimed Task Actions component
 */
export class ClaimedTaskActionsDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
