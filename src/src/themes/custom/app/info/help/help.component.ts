import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { HelpComponent as BaseComponent } from '../../../../../app/info/help/help.component';

@Component({
  selector: 'ds-themed-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  imports: [TranslateModule],
})
export class HelpComponent extends BaseComponent {
}
