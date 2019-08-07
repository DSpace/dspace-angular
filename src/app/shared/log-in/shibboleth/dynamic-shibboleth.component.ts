/**
 * /users/sign-in
 * @class LogInComponent
 */
import {Component, Inject, Input, OnInit} from '@angular/core';
import {InputDecorator} from '@angular/core/src/metadata/directives';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'ds-dynamic-shibboleth',
  templateUrl: './dynamic-shibboleth.component.html',
  styleUrls: ['./dynamic-shibboleth.component.scss'],

})
export class DynamicShibbolethComponent {

  /**
   * @constructor
   */
  constructor(@Inject('shibbolethUrlProvider') public injectedShibbolethUrl: string) {
  }
}
