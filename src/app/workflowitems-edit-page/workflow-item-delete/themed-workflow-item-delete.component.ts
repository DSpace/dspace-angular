import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { WorkflowItemDeleteComponent } from './workflow-item-delete.component';

/**
 * Themed wrapper for WorkflowItemDeleteComponent
 */

@Component({
  selector: 'ds-workflow-item-delete',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [WorkflowItemDeleteComponent],
})
export class ThemedWorkflowItemDeleteComponent extends ThemedComponent<WorkflowItemDeleteComponent> {
  protected getComponentName(): string {
    return 'WorkflowItemDeleteComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/workflowitems-edit-page/workflow-item-delete/workflow-item-delete.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./workflow-item-delete.component`);
  }
}
