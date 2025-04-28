import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { ResourcePolicy } from '../../../core/resource-policy/models/resource-policy.model';
import { ThemedComponent } from '../../theme-support/themed.component';
import {
  ResourcePolicyEvent,
  ResourcePolicyFormComponent,
} from './resource-policy-form.component';

/**
 * Themed wrapper for {@link ResourcePolicyFormComponent}
 */
@Component({
  selector: 'ds-resource-policy-form',
  templateUrl: '../../theme-support/themed.component.html',
  standalone: true,
  imports: [ResourcePolicyFormComponent],
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
