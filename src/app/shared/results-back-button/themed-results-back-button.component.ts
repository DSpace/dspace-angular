import {
  Component,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';

import { ThemedComponent } from '../theme-support/themed.component';
import { ResultsBackButtonComponent } from './results-back-button.component';

@Component({
  selector: 'ds-themed-results-back-button',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedResultsBackButtonComponent extends ThemedComponent<ResultsBackButtonComponent> {

  @Input() buttonLabel?: Observable<any>;

  @Input() back;

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
