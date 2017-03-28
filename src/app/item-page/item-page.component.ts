import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from "../core/shared/item.model";
import { ItemDataService } from "../core/data-services/item-data.service";
import { RemoteData } from "../core/data-services/remote-data";

@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.css'],
  templateUrl: './item-page.component.html'
})
export class ItemPageComponent implements OnInit {

  id: number;
  private sub: any;
  item : RemoteData<Item>;

  constructor(  private route: ActivatedRoute, private items : ItemDataService) {
    this.universalInit();
  }

  universalInit() {

  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.item = this.items.findById(params['id']);
    });

  }


}
