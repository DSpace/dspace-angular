import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { Item } from '../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../item-page-routing-paths';
import { ItemVersionsSummaryModalComponent } from '../../../../shared/item/item-versions/item-versions-summary-modal/item-versions-summary-modal.component';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { NotificationsService } from '../../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { VersionDataService } from '../../../../core/data/version-data.service';

@Component({
  selector: 'ds-item',
  template: ''
})
/**
 * A generic component for displaying metadata and relations of an item
 */
export class ItemComponent implements OnInit {
  @Input() object: Item;

  /**
   * Route to the item page
   */
  itemPageRoute: string;

  mediaViewer = environment.mediaViewer;

  constructor(
    private modalService: NgbModal,
    private versionHistoryService: VersionHistoryDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    // private itemService: ItemDataService,
    private versionService: VersionDataService,
  ) {
  }

  createNewVersion() {
    const successMessageKey = 'item.version.create.notification.success';
    const failureMessageKey = 'item.version.create.notification.failure';
    const item = this.object;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);

    this.versionService.findByHref(item._links.version.href).pipe(getFirstCompletedRemoteData()).subscribe(
      (res) => {
        // TODO check serve async?
        activeModal.componentInstance.firstVersion = res.hasNoContent;
        activeModal.componentInstance.versionNumber = (res.hasNoContent ? undefined : res.payload.version);
      }
    );

    // On modal submit/dismiss
    activeModal.result.then((modalResult) => {
      const summary = modalResult;

      const itemHref = item._links.self.href;

      this.versionHistoryService.createVersion(itemHref, summary).pipe(take(1)).subscribe((postResult) => {
        if (postResult.hasSucceeded) {
          const newVersionNumber = postResult.payload.version;
          this.notificationsService.success(null, this.translateService.get(successMessageKey, {version: newVersionNumber}));
        } else {
          this.notificationsService.error(null, this.translateService.get(failureMessageKey));
        }
      });
    });
  }

  ngOnInit(): void {
    this.itemPageRoute = getItemPageRoute(this.object);
  }
}
