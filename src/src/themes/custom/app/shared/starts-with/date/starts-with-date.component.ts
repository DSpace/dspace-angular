import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { StartsWithDateComponent as BaseComponent } from '../../../../../../app/shared/starts-with/date/starts-with-date.component';

@Component({
  selector: 'ds-starts-with-date',
  styleUrls: ['../../../../../../app/shared/starts-with/date/starts-with-date.component.scss'],
  templateUrl: './starts-with-date.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class StartsWithDateComponent extends BaseComponent {
}
