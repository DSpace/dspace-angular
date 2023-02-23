import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { isNotUndefined } from '../../../../shared/empty.util';

@Component({
  selector: 'ds-clarin-generic-item-field',
  templateUrl: './clarin-generic-item-field.component.html',
  styleUrls: ['./clarin-generic-item-field.component.scss']
})
export class ClarinGenericItemFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fontawesome v5. icon name with default settings.
   */
  @Input() iconName: string;

  /**
   * For now the specific type could be only 'hyperlink' which redirects to the page from the metadata value.
   */
  @Input() type: string;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  // tslint:disable-next-line:no-empty
  constructor() { }

  // tslint:disable-next-line:no-empty
  ngOnInit(): void {
  }

  public hasMetadataValue() {
    return isNotUndefined(this.item.firstMetadataValue(this.fields));
  }

}
