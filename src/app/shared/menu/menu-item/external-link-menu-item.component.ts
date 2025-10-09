import { NgClass } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { isNotEmpty } from '../../empty.util';
import { ExternalLinkMenuItemModel } from './models/external-link.model';

/**
 * Component that renders a menu section of type EXTERNAL
 */
@Component({
  selector: 'ds-external-link-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './external-link-menu-item.component.html',
  standalone: true,
  imports: [
    NgClass,
    RouterLinkActive,
    TranslateModule,
  ],
})
export class ExternalLinkMenuItemComponent implements OnInit {
  item: ExternalLinkMenuItemModel;

  hasLink: boolean;

  constructor(
    @Inject('itemModelProvider') item: ExternalLinkMenuItemModel,
  ) {
    this.item = item;
  }

  ngOnInit() {
    this.hasLink = isNotEmpty(this.item.href);
  }

  get href() {
    if (this.hasLink) {
      return this.item.href;
    }
    return undefined;
  }
}
