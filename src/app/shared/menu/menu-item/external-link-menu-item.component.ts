import { Component, Inject, OnInit } from '@angular/core';
import { isNotEmpty } from '../../empty.util';
import { ExternalLinkMenuItemModel } from './models/external-link.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

/**
 * Component that renders a menu section of type EXTERNAL
 */
@Component({
  selector: 'ds-external-link-menu-item',
  styleUrls: ['./menu-item.component.scss'],
  templateUrl: './external-link-menu-item.component.html',
  standalone: true,
  imports: [NgClass, TranslateModule]
})
export class ExternalLinkMenuItemComponent implements OnInit {
  item: ExternalLinkMenuItemModel;

  hasLink: boolean;

  constructor(
    @Inject('itemModelProvider') item: ExternalLinkMenuItemModel
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
