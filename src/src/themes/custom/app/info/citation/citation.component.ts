import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { CitationComponent as BaseComponent } from '../../../../../app/info/citation/citation.component';

@Component({
  selector: 'ds-themed-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss'],
  imports: [TranslateModule],
})
export class CitationComponent extends BaseComponent {
}
