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

  @Output() processCompleted: EventEmitter<MyDSpaceActionsResult> = new EventEmitter();

  protected inAndOutputNames: (keyof WorkspaceitemActionsComponent & keyof this)[] = [
    'object',
    'processCompleted',
  ];

  protected getComponentName(): string {
    return 'WorkspaceitemActionsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/mydspace-actions/workspaceitem/workspaceitem-actions.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./workspaceitem-actions.component');
  }
}
