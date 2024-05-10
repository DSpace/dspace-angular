import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ComcolPageHandleComponent as BaseComponent } from '../../../../../../app/shared/comcol/comcol-page-handle/comcol-page-handle.component';

@Component({
  selector: 'ds-themed-comcol-page-handle',
  // templateUrl: './comcol-page-handle.component.html',
  templateUrl: '../../../../../../app/shared/comcol/comcol-page-handle/comcol-page-handle.component.html',
  // styleUrls: ['./comcol-page-handle.component.scss'],
  styleUrls: ['../../../../../../app/shared/comcol/comcol-page-handle/comcol-page-handle.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    TranslateModule,
  ],
})
export class ComcolPageHandleComponent extends BaseComponent {
}
