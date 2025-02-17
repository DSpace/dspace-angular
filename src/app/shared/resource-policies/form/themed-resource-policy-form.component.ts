import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemedComponent } from '../../theme-support/themed.component';
import { ResourcePolicyFormComponent, ResourcePolicyEvent } from './resource-policy-form.component';
import { ResourcePolicy } from '../../../core/resource-policy/models/resource-policy.model';
import { Observable, of as observableOf } from 'rxjs';

/**
 * Themed wrapper for {@link ResourcePolicyFormComponent}
 */
@Component({
  selector: 'ds-themed-resource-policy-form',
  templateUrl: '../../theme-support/themed.component.html',
})
export class ThemedResourcePolicyFormComponent extends ThemedComponent<ResourcePolicyFormComponent> {

  @Input() resourcePolicy: ResourcePolicy;

  @Input() isProcessing: Observable<boolean> = observableOf(false);

  @Output() reset: EventEmitter<any> = new EventEmitter<any>();

  @Output() submit: EventEmitter<ResourcePolicyEvent> = new EventEmitter<ResourcePolicyEvent>();

  protected inAndOutputNames: (keyof ResourcePolicyFormComponent & keyof this)[] = [
    'resourcePolicy',
    'isProcessing',
    'reset',
    'submit',
  ];

  protected getComponentName(): string {
    return 'ResourcePolicyFormComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/resource-policies/form/resource-policy-form.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./resource-policy-form.component');
  }
}
