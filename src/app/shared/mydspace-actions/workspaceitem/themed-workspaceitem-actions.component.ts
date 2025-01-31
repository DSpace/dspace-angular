import {Component, EventEmitter, Input, Output} from '@angular/core';
import { WorkspaceitemActionsComponent } from './workspaceitem-actions.component';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import {ThemedComponent} from '../../theme-support/themed.component';
import {MyDSpaceActionsResult} from '../mydspace-actions';

/**
 * Themed version of WorkspaceitemActionsComponent
 */
@Component({
  selector: 'ds-themed-workspaceitem-actions',
  templateUrl: './../../../shared/theme-support/themed.component.html',
})
export class ThemedWorkspaceitemActionsComponent extends ThemedComponent<WorkspaceitemActionsComponent> {

  /**
   * Replicate all @Input() properties from WorkspaceitemActionsComponent.
   * Note we do NOT set default values here.
   */
  @Input() object: WorkspaceItem;


  @Output() processCompleted = new EventEmitter<MyDSpaceActionsResult>();

  /**
   * Indicate which class members are recognized as in/outputs
   * and which property names we want forwarded to the unthemed component.
   */
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
