import { Component } from '@angular/core';

import { LangSwitchComponent as BaseComponent } from '../../../../../app/shared/lang-switch/lang-switch.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgForOf, NgIf } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-lang-switch',
  // styleUrls: ['./lang-switch.component.scss'],
  styleUrls: ['../../../../../app/shared/lang-switch/lang-switch.component.scss'],
  // templateUrl: './lang-switch.component.html',
  templateUrl: '../../../../../app/shared/lang-switch/lang-switch.component.html',
  standalone: true,
  imports: [NgIf, NgbDropdownModule, NgForOf, TranslateModule]
})
export class LangSwitchComponent extends BaseComponent {
}
