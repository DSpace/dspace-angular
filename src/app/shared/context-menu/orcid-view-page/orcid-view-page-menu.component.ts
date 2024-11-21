import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

@Component({
  selector: 'ds-orcid-view-page',
  templateUrl: './orcid-view-page-menu.component.html',
  styleUrls: ['./orcid-view-page-menu.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
export class OrcidViewPageMenuComponent extends ContextMenuEntryComponent implements OnInit {

  /**
   * The prefix of the route to the edit page (before the object's UUID, e.g. "items")
   */
  pageRoute: string;

  /**
   * Whether the current user is authorized to edit the DSpaceObject
   */
  isAuthorized: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {AuthorizationDataService} authorizationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    protected authorizationService: AuthorizationDataService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.OrcidView);
  }

  ngOnInit() {
    this.authorizationService.isAuthorized(FeatureID.CanSynchronizeWithORCID, this.contextMenuObject.self).pipe(take(1))
      .subscribe((isAuthorized: boolean) => {
        this.isAuthorized.next(isAuthorized);
      });
  }

}
