import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { ThemedComponent } from '../../theme-support/themed.component';
import { MyDSpaceActionsResult } from '../mydspace-actions';
import { WorkspaceitemActionsComponent } from './workspaceitem-actions.component';

/**
 * Themed wrapper for {@link WorkspaceitemActionsComponent}
 */
@Component({
  selector: 'ds-workspaceitem-actions',
  templateUrl: './../../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [WorkspaceitemActionsComponent],
})
export class ThemedWorkspaceitemActionsComponent extends ThemedComponent<WorkspaceitemActionsComponent> {


  @Input() object: WorkspaceItem;


  @Output() processCompleted = new EventEmitter<MyDSpaceActionsResult>();

  protected inAndOutputNames: (keyof WorkspaceitemActionsComponent & keyof this)[] = [
    'object',
    'processCompleted',
  ];

  /**
   * Return the exact class name of the unthemed component
   */
  protected getComponentName(): string {
    return 'WorkspaceitemActionsComponent';
  }

  /**
   * Dynamically load a theme-specific version if available
   */
  protected importThemedComponent(themeName: string): Promise<any> {
    return import(
      `../../../../themes/${themeName}/app/shared/mydspace-actions/workspaceitem/workspaceitem-actions.component`
    );
  }

  /**
   * Load the default, unthemed version
   */
  protected importUnthemedComponent(): Promise<any> {
    return import(`./workspaceitem-actions.component`);
  }
}
