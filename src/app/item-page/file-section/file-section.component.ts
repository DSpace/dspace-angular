import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from "../../core/shared/bitstream.model";
import { Item } from "../../core/shared/item.model";
import { Observable } from "rxjs";

@Component({
  selector: 'ds-item-page-file-section',
  templateUrl: './file-section.component.html'
})
export class FileSectionComponent implements OnInit {

  @Input() item: Item;
  label : string = "item.page.files";
  files: Observable<Array<Observable<Bitstream>>>;

  constructor() {
    this.universalInit();

  }

  universalInit() {
  }

  ngOnInit(): void {
    this.files = this.item.getFiles();
  }


}
