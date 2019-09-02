import { Component, Inject, Input, OnInit } from '@angular/core';
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

  @Input() authMethodModel: AuthMethodModel;

  buttonHref: string;

  /**
   * @constructor
   */
  constructor(@Inject('authMethodModelProvider') public injectedAuthMethodModel: AuthMethodModel) {
    this.authMethodModel = injectedAuthMethodModel;
    this.buttonHref = ('https://fis.tiss.tuwien.ac.at' + this.authMethodModel.location + '/shibboleth')
  }

  ngOnInit(): void {
    console.log('injectedAuthMethodModel', this.injectedAuthMethodModel);
  }

}
