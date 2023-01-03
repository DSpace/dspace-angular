import { Component } from '@angular/core';
import { ClaimedTaskActionsAbstractComponent } from './claimed-task-actions-abstract.component';

/**
 * Abstract component for rendering an advanced claimed task's action
 * To create a child-component for a new option:
 * - Set the "option" of the component
 * - Add a @rendersWorkflowTaskOption annotation to your component providing the same enum value
 * - Optionally overwrite createBody if the request body requires more than just the option
 */
@Component({
  selector: 'ds-advanced-claimed-task-action-abstract',
  template: ''
})
export abstract class AdvancedClaimedTaskActionsAbstractComponent extends ClaimedTaskActionsAbstractComponent {
}
