import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from "../core/shared/item.model";
import { ItemDataService } from "../core/data/item-data.service";
import { RemoteData } from "../core/data/remote-data";
import { Observable } from "rxjs";
import { Bitstream } from "../core/shared/bitstream.model";

@Component({
    selector: 'ds-item-page',
    styleUrls: ['./item-page.component.css'],
    templateUrl: './item-page.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemPageComponent implements OnInit {

    id: number;
    private sub: any;
    item: RemoteData<Item>;
    thumbnail: Observable<Bitstream>;

    constructor(private route: ActivatedRoute, private items: ItemDataService) {
        this.universalInit();
    }

    universalInit() {

    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.item = this.items.findById(params['id']);
            this.thumbnail = this.item.payload.flatMap(i => i.getThumbnail());
        });


    }


}
