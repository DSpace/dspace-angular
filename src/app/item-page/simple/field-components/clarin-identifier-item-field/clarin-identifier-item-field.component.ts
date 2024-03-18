import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ItemIdentifierService } from '../../../../shared/item-identifier.service';


@Component({
  selector: 'ds-clarin-identifier-item-field',
  templateUrl: './clarin-identifier-item-field.component.html',
  styleUrls: ['./clarin-identifier-item-field.component.scss']
})
export class ClarinIdentifierItemFieldComponent implements OnInit {

  /**
   * After clicking on the `Copy` icon the message `Copied` is popped up.
   */
  @ViewChild('copyButton', {static: false}) copyButtonRef: NgbTooltip;

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * The identifier of the item. DOI or handle.
   */
  identifier: string;

  /**
   * BehaviorSubject to store the prettified identifier.
   */
  prettifiedIdentifier: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private itemIdentifierService: ItemIdentifierService,
              private clipboard: Clipboard) {
  }

  ngOnInit(): void {
    this.identifier = this.item?.firstMetadataValue(this.fields);
    void this.itemIdentifierService.prettifyIdentifier(this.identifier, this.fields)
      .then((value: string) => {
        this.prettifiedIdentifier.next(value);
      });
  }

  /**
   * Copy the metadata value to the clipboard. After clicking on the `Copy` icon the message `Copied` is popped up.
   *
   * @param value
   */
  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    setTimeout(() => {
      this.copyButtonRef.close();
    }, 700);
  }
}
