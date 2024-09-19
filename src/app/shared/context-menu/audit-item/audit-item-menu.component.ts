import { Component, Inject, OnInit } from '@angular/core';

import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { take } from 'rxjs/operators';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

/**
 * This component renders a context menu option that provides to export an item.
 */
@Component({
  selector: 'ds-context-menu-audit-item',
  templateUrl: './audit-item-menu.component.html'
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class AuditItemMenuComponent extends ContextMenuEntryComponent implements OnInit {

  public isAuthorized: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(false);

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private authorizationService: AuthorizationDataService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.Audit);
  }

  ngOnInit(): void {
    combineLatest(
      [
        this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
        this.authorizationService.isAuthorized(FeatureID.IsCollectionAdmin),
        this.authorizationService.isAuthorized(FeatureID.IsCommunityAdmin),
      ]
    ).pipe(
      take(1)
    ).subscribe(([isAdmin, isCollectionAdmin, isCommunityAdmin]) => {
      this.isAuthorized.next(isAdmin || isCommunityAdmin || isCollectionAdmin);
    });
  }
}
