import { Component, Input } from '@angular/core';

import { Policy } from '../../../../core/submission/models/sherpa-policies-details.model';

@Component({
  selector: 'ds-publisher-policy',
  templateUrl: './publisher-policy.component.html',
  styleUrls: ['./publisher-policy.component.scss']
})
export class PublisherPolicyComponent {

  /**
   * Policy to show information from
   */
  @Input() policy: Policy;

}
