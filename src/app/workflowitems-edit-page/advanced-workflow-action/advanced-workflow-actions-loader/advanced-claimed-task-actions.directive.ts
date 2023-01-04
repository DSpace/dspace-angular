import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dsAdvancedClaimedTaskActions]',
})
/**
 * Directive used as a hook to know where to inject the dynamic Advanced Claimed Task Actions component
 */
export class AdvancedClaimedTaskActionsDirective {

  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }

}
