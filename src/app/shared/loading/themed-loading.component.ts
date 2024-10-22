import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { LoadingComponent } from './loading.component';
import { ThemeService } from '../theme-support/theme.service';

/**
 * Themed wrapper for LoadingComponent
 */
@Component({
  selector: 'ds-themed-loading',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
})
export class ThemedLoadingComponent extends ThemedComponent<LoadingComponent> {

  @Input() message: string;
  @Input() showMessage: boolean;
  @Input() spinner: boolean;
  @Input() showFallbackMessages: boolean;
  @Input() numberOfAutomaticPageReloads: number;
  @Input() warningMessage: string;
  @Input() warningMessageDelay: number;
  @Input() errorMessage: string;
  @Input() errorMessageDelay: number;

  protected inAndOutputNames: (keyof LoadingComponent & keyof this)[] = [
    'message',
    'showMessage',
    'spinner',
    'showFallbackMessages',
    'numberOfAutomaticPageReloads',
    'warningMessage',
    'warningMessageDelay',
    'errorMessage',
    'errorMessageDelay'
  ];

  constructor(
    protected cdr: ChangeDetectorRef,
    protected themeService: ThemeService
  ) {
    super(cdr, themeService);
  }

  protected getComponentName(): string {
    return 'LoadingComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/loading/loading.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./loading.component');
  }
}
