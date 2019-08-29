import {Component, Inject, Input, OnInit} from '@angular/core';
import { renderAuthMethodFor } from '../../authMethods-decorator';
import { AuthMethodType } from '../../authMethods-type';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';

@Component({
  selector: 'ds-dynamic-shibboleth',
  templateUrl: './dynamic-shibboleth.component.html',
  styleUrls: ['./dynamic-shibboleth.component.scss'],

})
@renderAuthMethodFor(AuthMethodType.Shibboleth)
export class DynamicShibbolethComponent implements OnInit {

  /**
   * @constructor
   */
  constructor(@Inject('authMethodProvider') public injectedObject: AuthMethodModel) {
  }

  ngOnInit(): void {
    console.log('injectedObject', this.injectedObject)
  }

}
