import { KeyValuePipe } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { Policy } from '../../../../core/submission/models/sherpa-policies-details.model';
import { AlertType } from '../../../../shared/alert/alert-type';
import { ContentAccordionComponent } from '../content-accordion/content-accordion.component';

/**
 * This component represents a section that contains the publisher policy information.
 */
@Component({
  selector: 'ds-publisher-policy',
  templateUrl: './publisher-policy.component.html',
  styleUrls: ['./publisher-policy.component.scss'],
  imports: [
    ContentAccordionComponent,
    KeyValuePipe,
    TranslateModule,
  ],
  standalone: true,
})
export class PublisherPolicyComponent {

  /**
   * Policy to show information from
   */
  @Input() policy: Policy;


  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;

}
