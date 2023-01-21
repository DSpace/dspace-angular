import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { ResultsBackButtonComponent } from './results-back-button.component';
import { BehaviorSubject } from 'rxjs';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

@Component({
  selector: 'ds-themed-results-back-button',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedResultsBackButtonComponent extends ThemedComponent<ResultsBackButtonComponent> {

  @Input() previousPage$?: BehaviorSubject<string>;

  @Input() paginationConfig?: PaginationComponentOptions;

  protected inAndOutputNames: (keyof ResultsBackButtonComponent & keyof this)[] = ['previousPage$', 'paginationConfig'];

  protected getComponentName(): string {
    return 'ResultsBackButtonComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/results-back-button/results-back-button.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./results-back-button.component`);
  }

}
