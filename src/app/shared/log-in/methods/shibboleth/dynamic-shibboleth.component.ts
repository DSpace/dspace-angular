import { Component, Inject, Input, OnInit } from '@angular/core';
import { renderAuthMethodFor } from '../../authMethods-decorator';
import { AuthMethodType } from '../../authMethods-type';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
   * The authentication form.
   * @type {FormGroup}
   */
  public shibbForm: FormGroup;

  /**
   * @constructor
   */
  constructor(@Inject('authMethodModelProvider') public injectedAuthMethodModel: AuthMethodModel,
              private formBuilder: FormBuilder) {
    this.authMethodModel = injectedAuthMethodModel;
    this.buttonHref = ('https://fis.tiss.tuwien.ac.at' + this.authMethodModel.location + '/shibboleth')
  }

  ngOnInit(): void {
    console.log('injectedAuthMethodModel', this.injectedAuthMethodModel);
    // set formGroup
    this.shibbForm = this.formBuilder.group({
      shibbButton: [''],
    });
  }

  submit() {
    console.log('submit() was callled');
  }
}
