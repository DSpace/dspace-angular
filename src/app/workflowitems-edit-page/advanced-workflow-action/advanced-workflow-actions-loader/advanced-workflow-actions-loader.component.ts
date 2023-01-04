import { Component, Input, ViewChild, ComponentFactoryResolver, OnInit } from '@angular/core';
import { hasValue } from '../../../shared/empty.util';
import {
  getAdvancedComponentByWorkflowTaskOption
} from '../../../shared/mydspace-actions/claimed-task/switcher/claimed-task-actions-decorator';
import { AdvancedClaimedTaskActionsDirective } from './advanced-claimed-task-actions.directive';
import { Router } from '@angular/router';
import { PAGE_NOT_FOUND_PATH } from '../../../app-routing-paths';

@Component({
  selector: 'ds-advanced-workflow-actions-loader',
  templateUrl: './advanced-workflow-actions-loader.component.html',
  styleUrls: ['./advanced-workflow-actions-loader.component.scss'],
})
export class AdvancedWorkflowActionsLoaderComponent implements OnInit {

  /**
   * The name of the type to render
   * Passed on to the decorator to fetch the relevant component for this option
   */
  @Input() type: string;

  /**
   * Directive to determine where the dynamic child component is located
   */
  @ViewChild(AdvancedClaimedTaskActionsDirective, { static: true }) claimedTaskActionsDirective: AdvancedClaimedTaskActionsDirective;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
  ) {
  }

  /**
   * Fetch, create and initialize the relevant component
   */
  ngOnInit(): void {
    const comp = this.getComponentByWorkflowTaskOption(this.type);
    if (hasValue(comp)) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(comp);

      const viewContainerRef = this.claimedTaskActionsDirective.viewContainerRef;
      viewContainerRef.clear();
      viewContainerRef.createComponent(componentFactory);
    } else {
      void this.router.navigate([PAGE_NOT_FOUND_PATH]);
    }
  }

  getComponentByWorkflowTaskOption(option: string) {
    return getAdvancedComponentByWorkflowTaskOption(option);
  }

}
