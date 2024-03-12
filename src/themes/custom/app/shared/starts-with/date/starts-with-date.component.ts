import { Component } from '@angular/core';

import {
  StartsWithDateComponent as BaseComponent
} from '../../../../../../app/shared/starts-with/date/starts-with-date.component';
import { StartsWithType, } from '../../../../../../app/shared/starts-with/starts-with-decorator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-starts-with-date',
  // styleUrls: ['./starts-with-date.component.scss'],
  styleUrls: ['../../../../../../app/shared/starts-with/date/starts-with-date.component.scss'],
  // templateUrl: './starts-with-date.component.html',
  templateUrl: '../../../../../../app/shared/starts-with/date/starts-with-date.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgFor, TranslateModule]
})
export class StartsWithDateComponent extends BaseComponent {
}
