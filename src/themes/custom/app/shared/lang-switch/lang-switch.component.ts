import {
  NgFor,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { LangSwitchComponent as BaseComponent } from '../../../../../app/shared/lang-switch/lang-switch.component';

@Component({
  selector: 'ds-themed-lang-switch',
  // styleUrls: ['./lang-switch.component.scss'],
  styleUrls: ['../../../../../app/shared/lang-switch/lang-switch.component.scss'],
  // templateUrl: './lang-switch.component.html',
  templateUrl: '../../../../../app/shared/lang-switch/lang-switch.component.html',
  standalone: true,
  imports: [NgIf, NgbDropdownModule, NgFor, TranslateModule],
})
export class LangSwitchComponent extends BaseComponent {
}
