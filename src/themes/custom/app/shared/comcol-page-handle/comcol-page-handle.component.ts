import { Component } from '@angular/core';
import {
  ComcolPageHandleComponent as BaseComponent
} from '../../../../../app/shared/comcol/comcol-page-handle/comcol-page-handle.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


/**
 * This component builds a URL from the value of "handle"
 */

@Component({
  selector: 'ds-comcol-page-handle',
  // templateUrl: './comcol-page-handle.component.html',
  templateUrl: '../../../../../app/shared/comcol/comcol-page-handle/comcol-page-handle.component.html',
  // styleUrls: ['./comcol-page-handle.component.scss'],
  styleUrls: ['../../../../../app/shared/comcol/comcol-page-handle/comcol-page-handle.component.scss'],
  standalone: true,
  imports: [NgIf, TranslateModule],
})
export class ComcolPageHandleComponent extends BaseComponent {}
