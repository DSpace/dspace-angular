import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { Component } from '@angular/core';
import { WorkflowItemViewComponent } from './workflow-item-view.component';

/**
 * Themed wrapper for WorkflowItemViewComponent
 */

@Component({
  selector: 'ds-themed-workflow-item-view',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html'
})
export class ThemedWorkflowItemViewComponent extends ThemedComponent<WorkflowItemViewComponent> {
  protected getComponentName(): string {
    return 'WorkflowItemViewComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/+workflowitems-edit-page/workflow-item-view/workflow-item-view.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./workflow-item-view.component`);
  }
}
