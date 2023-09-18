import { Component, OnInit } from '@angular/core';
import { NotifyInfoService } from './notify-info.service';


@Component({
    selector: 'ds-notify-info',
    templateUrl: './notify-info.component.html',
    styleUrls: ['./notify-info.component.scss']
})
export class NotifyInfoComponent implements OnInit {
    coarLdnEnabled: boolean;
    coarRestApiUrl: string;

    constructor(
        public notifyInfoService: NotifyInfoService,
    ) {
    }

    ngOnInit() {
        this.coarRestApiUrl = this.notifyInfoService.getCoarLdnRestApiUrl();

        this.notifyInfoService.isCoarConfigEnabled().subscribe(value => {
            this.coarLdnEnabled = value;
        });
    }
}
