import { Component, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { rendersAuthMethodType } from '../authMethods-decorator';
import { AuthMethodModel } from '../../../core/auth/models/auth-method.model';
import { getAuthenticationMethods } from '../../../core/auth/selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.reducer';
import { Observable } from 'rxjs';
import { AuthMethodType } from '../authMethods-type';

/**
 * This component represents a section that contains the submission license form.
 */
@Component({
  selector: 'ds-login-container',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss']
})
export class LoginContainerComponent implements OnInit {

  @Input() authMethodModel: AuthMethodModel;

  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   */
  constructor(private injector: Injector) {
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.objectInjector = Injector.create({
      providers: [
        {provide: 'authMethodModelProvider', useFactory: () => (this.authMethodModel), deps: []},
      ],
      parent: this.injector
    });

     }

  /**
   * Find the correct component based on the authMethod's type
   */
  getAuthMethodContent(): string {
    return rendersAuthMethodType(this.authMethodModel.authMethodType)
  }
}
