import { Component, Injector, Input, OnInit, Type } from '@angular/core';
import { rendersAuthMethodType } from '../methods/log-in.methods-decorator';
import { AuthMethod } from '../../../core/auth/models/auth.method';

/**
 * This component represents a component container for log-in methods available.
 */
@Component({
  selector: 'ds-log-in-container',
  templateUrl: './log-in-container.component.html',
  styleUrls: ['./log-in-container.component.scss']
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

  constructor(
    protected injector: Injector,
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
      parent: this.injector
    });
  }

  /**
   * Find the correct component based on the AuthMethod's type
   */
  getAuthMethodContent(): Type<Component> {
    return rendersAuthMethodType(this.authMethod.authMethodType);
  }

}
