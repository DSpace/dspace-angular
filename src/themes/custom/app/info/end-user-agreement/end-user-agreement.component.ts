import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { EndUserAgreementComponent as BaseComponent } from '../../../../../app/info/end-user-agreement/end-user-agreement.component';
import { EndUserAgreementContentComponent } from '../../../../../app/info/end-user-agreement/end-user-agreement-content/end-user-agreement-content.component';
import { BtnDisabledDirective } from '../../../../../app/shared/btn-disabled.directive';

@Component({
  selector: 'ds-themed-end-user-agreement',
  // styleUrls: ['./end-user-agreement.component.scss'],
  styleUrls: ['../../../../../app/info/end-user-agreement/end-user-agreement.component.scss'],
  // templateUrl: './end-user-agreement.component.html'
  templateUrl: '../../../../../app/info/end-user-agreement/end-user-agreement.component.html',
  standalone: true,
  imports: [
    BtnDisabledDirective,
    EndUserAgreementContentComponent,
    FormsModule,
    TranslateModule,
  ],
})
export class EndUserAgreementComponent extends BaseComponent {
}
