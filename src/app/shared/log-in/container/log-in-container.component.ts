import {
  AsyncPipe,
  NgComponentOutlet,
} from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  from,
  Observable,
} from 'rxjs';

import { AuthMethod } from '../../../core/auth/models/auth.method';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { ThemeService } from '../../theme-support/theme.service';
import { getAuthMethodFor } from '../methods/log-in.methods-decorator';

/**
 * This component represents a component container for log-in methods available.
 */
@Component({
  selector: 'ds-log-in-container',
  templateUrl: './log-in-container.component.html',
  styleUrls: ['./log-in-container.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgComponentOutlet,
  ],
})
export class LogInContainerComponent implements OnInit {

  @Input() authMethod: AuthMethod;

  /**
   * A boolean representing if LogInContainerComponent is in a standalone page
   * @type {boolean}
   */
  @Input() isStandalonePage: boolean;

  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  authMethodComponent$: Observable<GenericConstructor<Component>>;

  constructor(
    protected injector: Injector,
    protected themeService: ThemeService,
  ) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'authMethodProvider', useFactory: () => (this.authMethod), deps: [] },
        { provide: 'isStandalonePage', useFactory: () => (this.isStandalonePage), deps: [] },
      ],
      parent: this.injector,
    });
    this.authMethodComponent$ = this.getAuthMethodComponent();
  }

  /**
   * Find the correct component based on the AuthMethod's type
   */
  getAuthMethodComponent(): Observable<GenericConstructor<Component>> {
    return from(getAuthMethodFor(this.authMethod.authMethodType, this.themeService.getThemeName()));
  }

}
