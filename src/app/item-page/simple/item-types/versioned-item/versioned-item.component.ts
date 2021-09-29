import { Component } from '@angular/core';
import { ItemComponent } from '../shared/item.component';
import { ItemVersionsSummaryModalComponent } from '../../../../shared/item/item-versions/item-versions-summary-modal/item-versions-summary-modal.component';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { RemoteData } from '../../../../core/data/remote-data';
import { Version } from '../../../../core/shared/version.model';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VersionHistoryDataService } from '../../../../core/data/version-history-data.service';
import { TranslateService } from '@ngx-translate/core';
import { VersionDataService } from '../../../../core/data/version-data.service';
import { ItemVersionsSharedService } from '../../../../shared/item/item-versions/item-versions-shared.service';
import { Router } from '@angular/router';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { SearchService } from '../../../../core/shared/search/search.service';
import { Item } from '../../../../core/shared/item.model';
import { ItemDataService } from '../../../../core/data/item-data.service';
import { WorkspaceItem } from '../../../../core/submission/models/workspaceitem.model';

@Component({
  selector: 'ds-versioned-item',
  templateUrl: './versioned-item.component.html',
  styleUrls: ['./versioned-item.component.scss']
})
export class VersionedItemComponent extends ItemComponent {

  constructor(
    private modalService: NgbModal,
    private versionHistoryService: VersionHistoryDataService,
    private translateService: TranslateService,
    private versionService: VersionDataService,
    private itemVersionShared: ItemVersionsSharedService,
    private router: Router,
    private workspaceitemDataService: WorkspaceitemDataService,
    private searchService: SearchService,
    private itemService: ItemDataService,
  ) {
    super();
  }

  /**
   * Open a modal that allows to create a new version starting from the specified item, with optional summary
   */
  onCreateNewVersion(): void {

    const item = this.object;
    const versionHref = item._links.version.href;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);

    // Show current version in modal
    this.versionService.findByHref(versionHref).pipe(getFirstCompletedRemoteData()).subscribe((res: RemoteData<Version>) => {
      // if res.hasNoContent then the item is unversioned
      activeModal.componentInstance.firstVersion = res.hasNoContent;
      activeModal.componentInstance.versionNumber = (res.hasNoContent ? undefined : res.payload.version);
    });

    // On createVersionEvent emitted create new version and notify
    activeModal.componentInstance.createVersionEvent.pipe(
      switchMap((summary: string) => this.itemVersionShared.createNewVersionAndNotify(item, summary)),
      getFirstSucceededRemoteDataPayload<Version>(),
      switchMap((newVersion: Version) => this.itemService.findByHref(newVersion._links.item.href)),
      getFirstSucceededRemoteDataPayload<Item>(),
      switchMap((newVersionItem: Item) => this.workspaceitemDataService.findByItem(newVersionItem.uuid)),
      getFirstSucceededRemoteDataPayload<WorkspaceItem>(),
    ).subscribe((wsItem) => {
      const wsiId = wsItem.id;
      const route = 'workspaceitems/' + wsiId + '/edit';
      this.router.navigateByUrl(route);
    });

  }
}
