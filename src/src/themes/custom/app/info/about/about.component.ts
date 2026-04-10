import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { AboutComponent as BaseComponent } from '../../../../../app/info/about/about.component';

@Component({
  selector: 'ds-themed-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  imports: [TranslateModule],
})
export class AboutComponent extends BaseComponent {
  activeTab = 'sppel';

  setTab(tab: string): void {
    this.activeTab = tab;
  }
}
