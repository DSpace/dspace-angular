import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

@Component({
  selector: 'ds-dso-page-orcid-button',
  templateUrl: './dso-page-orcid-button.component.html',
  styleUrls: ['./dso-page-orcid-button.component.scss']
})
export class DsoPageOrcidButtonComponent implements OnInit {
 /**
  * The DSpaceObject to display a button to the edit page for
  */
 @Input() dso: DSpaceObject;

 /**
  * The prefix of the route to the edit page (before the object's UUID, e.g. "items")
  */
 @Input() pageRoute: string;

 /**
  * A message for the tooltip on the button
  * Supports i18n keys
  */
 @Input() tooltipMsg: string;

 /**
  * Whether or not the current user is authorized to edit the DSpaceObject
  */
 isAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(false);

 constructor(protected authorizationService: AuthorizationDataService) { }

 ngOnInit() {
   this.authorizationService.isAuthorized(FeatureID.CanSynchronizeWithORCID, this.dso.self).pipe(take(1)).subscribe((isAuthorized: boolean) => {
    this.isAuthorized.next(isAuthorized);
  });
 }

}
