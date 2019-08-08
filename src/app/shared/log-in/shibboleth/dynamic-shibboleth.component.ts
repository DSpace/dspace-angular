
import {Component, Inject, Input, OnInit} from '@angular/core';

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
