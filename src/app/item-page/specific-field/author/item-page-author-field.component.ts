import { Component, OnInit, Input } from '@angular/core';
import { Item } from "../../../core/shared/item.model";
import { Observable } from "rxjs";
import { ItemPageSpecificFieldComponent } from "../item-page-specific-field.component";

@Component({
  selector: 'ds-item-page-author-field',
  templateUrl: './../item-page-specific-field.component.html'
})
export class ItemPageAuthorFieldComponent extends ItemPageSpecificFieldComponent implements OnInit {

  @Input() item: Observable<Item>;

  fields : string[] = [
    "dc.contributor.author",
    "dc.creator",
    "dc.contributor"
  ];
  label : string = "item.page.author";
  separator : string = ",";

}
