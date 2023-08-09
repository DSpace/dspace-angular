import { Component, OnInit } from '@angular/core';
import { AuthorizationDataService } from '../../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../data/feature-authorization/feature-id';

@Component({
    selector: 'ds-notify-info',
    templateUrl: './notify-info.component.html',
    styleUrls: ['./notify-info.component.scss']
})
export class NotifyInfoComponent implements OnInit {

    coarLdnEnabled: boolean;

    constructor(
        private authorizationService: AuthorizationDataService,
    ) {
    }

    ngOnInit() {
        this.authorizationService.isAuthorized(FeatureID.CoarLdnEnabled).subscribe(enabled => {
            this.coarLdnEnabled = enabled;
        });
    }
}
