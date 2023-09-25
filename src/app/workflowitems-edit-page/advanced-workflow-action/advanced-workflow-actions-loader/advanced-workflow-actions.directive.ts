import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[dsAdvancedWorkflowActions]',
    standalone: true
})
/**
 * Directive used as a hook to know where to inject the dynamic Advanced Claimed Task Actions component
 */
export class AdvancedWorkflowActionsDirective {

  constructor(
    public viewContainerRef: ViewContainerRef,
  ) {
  }

}
