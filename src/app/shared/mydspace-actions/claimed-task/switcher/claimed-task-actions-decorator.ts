import { Component } from '@angular/core';

import { RENDERS_ADVANCED_WORKFLOW_TASK_OPTION_MAP } from '../../../../../decorator-registries/renders-advanced-workflow-task-option-registry';
import { RENDERS_WORKFLOW_TASK_OPTION_MAP } from '../../../../../decorator-registries/renders-workflow-task-option-registry';
import { GenericConstructor } from '../../../../core/shared/generic-constructor';
import { AdvancedWorkflowActionType } from '../../../../workflowitems-edit-page/advanced-workflow-action/advanced-workflow-action-type';
import { hasValue } from '../../../empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedTaskType } from '../claimed-task-type';

/**
 * Decorator used for rendering ClaimedTaskActions pages by option type
 */
export function rendersWorkflowTaskOption(option: ClaimedTaskType, theme: string = DEFAULT_THEME) {
  return function decorator(component: any): void {
  };
}

/**
 * Decorator used for rendering AdvancedClaimedTaskActions pages by option type
 */
export function rendersAdvancedWorkflowTaskOption(option: AdvancedWorkflowActionType, theme: string = DEFAULT_THEME) {
  return function decorator(component: any): void {
  };
}

/**
 * Get the component used for rendering a ClaimedTaskActions page by option type
 */
export function getComponentByWorkflowTaskOption(option: ClaimedTaskType, theme: string, registry: Map<string, Map<string, () => Promise<GenericConstructor<Component>>>> = RENDERS_WORKFLOW_TASK_OPTION_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [option, theme], ['*', DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}

/**
 * Get the component used for rendering a AdvancedClaimedTaskActions page by option type
 */
export function getAdvancedComponentByWorkflowTaskOption(option: AdvancedWorkflowActionType, theme: string, registry: Map<string, Map<string, () => Promise<GenericConstructor<Component>>>> = RENDERS_ADVANCED_WORKFLOW_TASK_OPTION_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [option, theme], ['*', DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
