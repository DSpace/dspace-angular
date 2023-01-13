import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { ResultsBackButtonComponent } from './results-back-button.component';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'ds-themed-results-back-button',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedResultsBackButtonComponent extends ThemedComponent<ResultsBackButtonComponent> {

  @Input() previousPage$?: BehaviorSubject<string>;

  @Input() paginationConfig?: PaginationComponentOptions;

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
