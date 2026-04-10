import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { EndUserAgreementComponent as BaseComponent } from '../../../../../app/info/end-user-agreement/end-user-agreement.component';
import { BtnDisabledDirective } from '../../../../../app/shared/btn-disabled.directive';

@Component({
  selector: 'ds-themed-end-user-agreement',
  styleUrls: ['./end-user-agreement.component.scss'],
  templateUrl: './end-user-agreement.component.html',
  imports: [
    BtnDisabledDirective,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class EndUserAgreementComponent extends BaseComponent {
}
