import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';

import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { ThemeService } from '../../../theme-support/theme.service';
import { CreateItemParentSelectorComponent } from './create-item-parent-selector.component';

/**
 * Themed wrapper for CreateItemParentSelectorComponent
 */
@Component({
  selector: 'ds-create-item-parent-selector',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [CreateItemParentSelectorComponent],
})
export class ThemedCreateItemParentSelectorComponent
  extends ThemedComponent<CreateItemParentSelectorComponent> {
  @Input() entityType: string;
  @Output() select: EventEmitter<DSpaceObject> = new EventEmitter<DSpaceObject>();
  @Input() emitOnly = false;

  protected inAndOutputNames: (keyof CreateItemParentSelectorComponent & keyof this)[] = ['entityType', 'select', 'emitOnly'];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected themeService: ThemeService,
  ) {
    super(cdr, themeService);
  }

  protected getComponentName(): string {
    return 'CreateItemParentSelectorComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./create-item-parent-selector.component');
  }

}
