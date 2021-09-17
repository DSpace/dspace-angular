import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ItemComponent } from '../shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { ItemVersionsSummaryModalComponent } from '../../../../shared/item/item-versions/item-versions-summary-modal/item-versions-summary-modal.component';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { take } from 'rxjs/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { Version } from '../../../../core/shared/version.model';

/**
 * Component that represents a publication Item page
 */

@listableObjectComponent(Item, ViewMode.StandalonePage)
@Component({
  selector: 'ds-untyped-item',
  styleUrls: ['./untyped-item.component.scss'],
  templateUrl: './untyped-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UntypedItemComponent extends ItemComponent {
  private activeModal: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private versionHistoryService: VersionHistoryDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    // private itemService: ItemDataService,
    private versionService: VersionDataService,
  ) {
    super();
  }

  createNewVersionNotify(success: boolean, newVersionNumber: number) {
    const successMessageKey = 'item.version.create.notification.success';
    const failureMessageKey = 'item.version.create.notification.failure';
    if (success) {
      this.notificationsService.success(null, this.translateService.get(successMessageKey, {version: newVersionNumber}));
    } else {
      this.notificationsService.error(null, this.translateService.get(failureMessageKey));
    }
  }

  createNewVersionSubmit(item: Item, summary: string) {
    const itemHref = item._links.self.href;
    this.versionHistoryService.createVersion(itemHref, summary).pipe(
      take(1)
    ).subscribe((postResult) => {
      this.createNewVersionNotify(postResult.hasSucceeded, postResult?.payload.version);
    });
  }

  createNewVersionModal() {
    const item = this.object;

    // Open modal
    this.activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);

    // Show current version in modal
    this.versionService.findByHref(item._links.version.href).pipe(
      getFirstCompletedRemoteData()
    ).subscribe(
      (res: RemoteData<Version>) => {
        // if response is empty then the item is unversioned
        this.activeModal.componentInstance.firstVersion = res.hasNoContent;
        this.activeModal.componentInstance.versionNumber = (res.hasNoContent ? undefined : res.payload.version);
      }
    );

    // On modal submit create version
    this.activeModal.result.then((modalResult) => {
      this.createNewVersionSubmit(item, modalResult);
    });
  }
}
