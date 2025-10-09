import {
  Component,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';

import { ThemedComponent } from '../theme-support/themed.component';
import { ResultsBackButtonComponent } from './results-back-button.component';

@Component({
  selector: 'ds-results-back-button',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
  standalone: true,
  imports: [
    ResultsBackButtonComponent,
  ],
})
export class ThemedResultsBackButtonComponent extends ThemedComponent<ResultsBackButtonComponent> {

  @Input() buttonLabel?: Observable<any>;

  @Input() back: () => void;

  protected inAndOutputNames: (keyof ResultsBackButtonComponent & keyof this)[] = ['back', 'buttonLabel'];

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
