import { Component, Input, ViewChild, OnInit, ComponentRef, OnDestroy } from '@angular/core';
import { hasValue } from '../../../shared/empty.util';
import {
  getAdvancedComponentByWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { AdvancedWorkflowActionsDirective } from './advanced-workflow-actions.directive';
import { Router } from '@angular/router';
import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';

/**
 * Component for loading a {@link AdvancedWorkflowActionComponent} depending on the "{@link type}" input
 */
@Component({
  selector: 'ds-advanced-workflow-actions-loader',
  templateUrl: './advanced-workflow-actions-loader.component.html',
  styleUrls: ['./advanced-workflow-actions-loader.component.scss'],
})
export class AdvancedWorkflowActionsLoaderComponent implements OnDestroy, OnInit {

  /**
   * The name of the type to render
   * Passed on to the decorator to fetch the relevant component for this option
   */
  @Input() type: string;

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(AdvancedWorkflowActionsDirective, { static: true }) claimedTaskActionsDirective: AdvancedWorkflowActionsDirective;

  /**
   * The reference to the dynamic component
   */
  protected compRef: ComponentRef<Component>;

  constructor(
    private router: Router,
  ) {
  }

  /**
   * Fetch, create and initialize the relevant component
   */
  ngOnInit(): void {
    const comp = this.getComponentByWorkflowTaskOption(this.type);
    if (hasValue(comp)) {
      const viewContainerRef = this.claimedTaskActionsDirective.viewContainerRef;
      viewContainerRef.clear();
      this.compRef = viewContainerRef.createComponent(comp);
    } else {
      void this.router.navigate([PAGE_NOT_FOUND_PATH]);
    }
  }

  /**
   * Destroy the dynamically created component
   */
  ngOnDestroy(): void {
    if (hasValue(this.compRef)) {
      this.compRef.destroy();
      this.compRef = undefined;
    }
  }

  getComponentByWorkflowTaskOption(type: string): any {
    return getAdvancedComponentByWorkflowTaskOption(type);
  }

}
