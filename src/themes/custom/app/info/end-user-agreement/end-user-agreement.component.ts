import { Component } from '@angular/core';
import { EndUserAgreementComponent as BaseComponent } from '../../../../../app/info/end-user-agreement/end-user-agreement.component';

@Component({
  selector: 'ds-home-news',
  // styleUrls: ['./end-user-agreement.component.scss'],
  styleUrls: ['../../../../../app/info/end-user-agreement/end-user-agreement.component.scss'],
  // templateUrl: './end-user-agreement.component.html'
  templateUrl: '../../../../../app/info/end-user-agreement/end-user-agreement.component.html'
})

/**
 * Component to render the news section on the home page
 */
export class EndUserAgreementComponent extends BaseComponent {}

