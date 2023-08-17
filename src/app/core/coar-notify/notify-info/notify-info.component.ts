import { Component, OnInit } from '@angular/core';
import { NotifyInfoService } from './notify-info.service';

@Component({
    selector: 'ds-notify-info',
    templateUrl: './notify-info.component.html',
    styleUrls: ['./notify-info.component.scss']
})
export class NotifyInfoComponent implements OnInit {

    coarLdnEnabled: boolean;

    constructor(
        public notifyInfoService: NotifyInfoService,
    ) { }

    ngOnInit() {
        this.notifyInfoService.isCoarConfigEnabled().subscribe(value => {
            this.coarLdnEnabled = value;
        });
    }

}
