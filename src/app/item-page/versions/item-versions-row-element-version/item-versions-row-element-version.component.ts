import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  combineLatest,
  concatMap,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { ItemDataService } from '../../../core/data/item-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { VersionDataService } from '../../../core/data/version-data.service';
import { VersionHistoryDataService } from '../../../core/data/version-history-data.service';
import { Item } from '../../../core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../../core/shared/operators';
import { Version } from '../../../core/shared/version.model';
import { VersionHistory } from '../../../core/shared/version-history.model';
import { WorkspaceItem } from '../../../core/submission/models/workspaceitem.model';
import { WorkflowItemDataService } from '../../../core/submission/workflowitem-data.service';
import { WorkspaceitemDataService } from '../../../core/submission/workspaceitem-data.service';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  getItemEditVersionhistoryRoute,
  getItemVersionRoute,
} from '../../item-page-routing-paths';
import { ItemVersionsDeleteModalComponent } from '../item-versions-delete-modal/item-versions-delete-modal.component';
import { ItemVersionsSharedService } from '../item-versions-shared.service';
import { ItemVersionsSummaryModalComponent } from '../item-versions-summary-modal/item-versions-summary-modal.component';

@Component({
  selector: 'ds-item-versions-row-element-version',
  standalone: true,
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgClass,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './item-versions-row-element-version.component.html',
  styleUrl: './item-versions-row-element-version.component.scss',
})
export class ItemVersionsRowElementVersionComponent implements OnInit {
  @Input() hasDraftVersion: boolean | null;
  @Input() version: Version;
  @Input() itemVersion: Version;
  @Input() item: Item;
  @Input() displayActions: boolean;
  @Input() versionBeingEditedNumber: number;

  @Output() versionsHistoryChange = new EventEmitter<Observable<VersionHistory>>();

  workspaceId$: Observable<string>;
  workflowId$: Observable<string>;
  canDeleteVersion$: Observable<boolean>;
  canCreateVersion$: Observable<boolean>;

  createVersionTitle: string;

  constructor(
    private workspaceItemDataService: WorkspaceitemDataService,
    private workflowItemDataService: WorkflowItemDataService,
    private router: Router,
    private itemService: ItemDataService,
    private authorizationService: AuthorizationDataService,
    private itemVersionShared: ItemVersionsSharedService,
    private versionHistoryService: VersionHistoryDataService,
    private versionService: VersionDataService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.workspaceId$ = this.getWorkspaceId(this.version.item);
    this.workflowId$ = this.getWorkflowId(this.version.item);
    this.canDeleteVersion$ = this.canDeleteVersion(this.version);
    this.canCreateVersion$ = this.authorizationService.isAuthorized(FeatureID.CanCreateVersion, this.item.self);

    this.createVersionTitle = this.hasDraftVersion ? 'item.version.history.table.action.hasDraft' : 'item.version.history.table.action.newVersion';
  }


  /**
   * Get the ID of the workspace item, if present, otherwise return undefined
   * @param versionItem the item for which retrieve the workspace item id
   */
  getWorkspaceId(versionItem: Observable<RemoteData<Item>>): Observable<string> {
    if (!this.hasDraftVersion) {
      return of(undefined);
    }
    return versionItem.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((item: Item) => item.uuid),
      switchMap((itemUuid: string) => this.workspaceItemDataService.findByItem(itemUuid, true)),
      getFirstCompletedRemoteData<WorkspaceItem>(),
      map((res: RemoteData<WorkspaceItem>) => res?.payload?.id),
    );
  }

  /**
   * Get the ID of the workflow item, if present, otherwise return undefined
   * @param versionItem the item for which retrieve the workspace item id
   */
  getWorkflowId(versionItem: Observable<RemoteData<Item>>): Observable<string> {
    return this.getWorkspaceId(versionItem).pipe(
      concatMap((workspaceId: string) => {
        if (workspaceId) {
          return of(undefined);
        }
        return versionItem.pipe(
          getFirstSucceededRemoteDataPayload(),
          map((item: Item) => item.uuid),
          switchMap((itemUuid: string) => this.workflowItemDataService.findByItem(itemUuid, true)),
          getFirstCompletedRemoteData<WorkspaceItem>(),
          map((res: RemoteData<WorkspaceItem>) => res?.payload?.id),
        );
      }),
    );
  }

  /**
   * redirect to the edit page of the workspace item
   * @param id$ the id of the workspace item
   */
  editWorkspaceItem(id$: Observable<string>) {
    id$.subscribe((id) => {
      void this.router.navigateByUrl('workspaceitems/' + id + '/edit');
    });
  }

  /**
   * Check if the current user can delete the version
   * @param version
   */
  canDeleteVersion(version: Version): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDeleteVersion, version.self);
  }

  /**
   * Get the route to the specified version
   * @param versionId the ID of the version for which the route will be retrieved
   */
  getVersionRoute(versionId: string) {
    return getItemVersionRoute(versionId);
  }

  /**
   * Creates a new version starting from the specified one
   * @param version the version from which a new one will be created
   */
  createNewVersion(version: Version) {
    const versionNumber = version.version;

    // Open modal and set current version number
    const activeModal = this.modalService.open(ItemVersionsSummaryModalComponent);
    activeModal.componentInstance.versionNumber = versionNumber;

    // On createVersionEvent emitted create new version and notify
    activeModal.componentInstance.createVersionEvent.pipe(
      mergeMap((summary: string) => combineLatest([
        of(summary),
        version.item.pipe(getFirstSucceededRemoteDataPayload()),
      ])),
      mergeMap(([summary, item]: [string, Item]) => this.versionHistoryService.createVersion(item._links.self.href, summary)),
      getFirstCompletedRemoteData(),
      // close model (should be displaying loading/waiting indicator) when version creation failed/succeeded
      tap(() => activeModal.close()),
      // show success/failure notification
      tap((newVersionRD: RemoteData<Version>) => {
        this.itemVersionShared.notifyCreateNewVersion(newVersionRD);
        if (newVersionRD.hasSucceeded) {
          const versionHistory$ = this.versionService.getHistoryFromVersion(version).pipe(
            tap((versionHistory: VersionHistory) => {
              this.itemService.invalidateItemCache(this.item.uuid);
              this.versionHistoryService.invalidateVersionHistoryCache(versionHistory.id);
            }),
          );
          this.versionsHistoryChange.emit(versionHistory$);
        }
      }),
      // get workspace item
      getFirstSucceededRemoteDataPayload<Version>(),
      switchMap((newVersion: Version) => this.itemService.findByHref(newVersion._links.item.href)),
      getFirstSucceededRemoteDataPayload<Item>(),
      switchMap((newVersionItem: Item) => this.workspaceItemDataService.findByItem(newVersionItem.uuid, true, false)),
      getFirstSucceededRemoteDataPayload<WorkspaceItem>(),
    ).subscribe((wsItem) => {
      const wsiId = wsItem.id;
      const route = 'workspaceitems/' + wsiId + '/edit';
      this.router.navigateByUrl(route);
    });
  }

  /**
   * Deletes the specified version, notify the success/failure and redirect to latest version
   * @param version the version to be deleted
   * @param redirectToLatest force the redirect to the latest version in the history
   */
  deleteVersion(version: Version, redirectToLatest: boolean): void {
    const successMessageKey = 'item.version.delete.notification.success';
    const failureMessageKey = 'item.version.delete.notification.failure';
    const versionNumber = version.version;
    const versionItem$ = version.item;

    // Open modal
    const activeModal = this.modalService.open(ItemVersionsDeleteModalComponent);
    activeModal.componentInstance.versionNumber = version.version;
    activeModal.componentInstance.firstVersion = false;

    // On modal submit/dismiss
    activeModal.componentInstance.response.pipe(take(1)).subscribe((ok) => {
      if (ok) {
        versionItem$.pipe(
          getFirstSucceededRemoteDataPayload<Item>(),
          // Retrieve version history
          mergeMap((item: Item) => combineLatest([
            of(item),
            this.versionHistoryService.getVersionHistoryFromVersion$(version),
          ])),
          // Delete item
          mergeMap(([item, versionHistory]: [Item, VersionHistory]) => combineLatest([
            this.deleteItemAndGetResult$(item),
            of(versionHistory),
          ])),
          // Retrieve new latest version
          mergeMap(([deleteItemResult, versionHistory]: [boolean, VersionHistory]) => combineLatest([
            of(deleteItemResult),
            this.versionHistoryService.getLatestVersionItemFromHistory$(versionHistory).pipe(
              tap(() => {
                this.versionsHistoryChange.emit(of(versionHistory));
              }),
            ),
          ])),
        ).subscribe(([deleteHasSucceeded, newLatestVersionItem]: [boolean, Item]) => {
          // Notify operation result and redirect to latest item
          if (deleteHasSucceeded) {
            this.notificationsService.success(null, this.translateService.get(successMessageKey, { 'version': versionNumber }));
          } else {
            this.notificationsService.error(null, this.translateService.get(failureMessageKey, { 'version': versionNumber }));
          }
          if (redirectToLatest) {
            const path = getItemEditVersionhistoryRoute(newLatestVersionItem);
            this.router.navigateByUrl(path);
          }
        });
      }
    });
  }

  /**
   * Delete the item and get the result of the operation
   * @param item
   */
  deleteItemAndGetResult$(item: Item): Observable<boolean> {
    return this.itemService.delete(item.id).pipe(
      getFirstCompletedRemoteData(),
      map((deleteItemRes) => deleteItemRes.hasSucceeded),
      take(1),
    );
  }

  /**
   * True when a version is being edited
   * (used to disable buttons for other versions)
   */
  isAnyBeingEdited(): boolean {
    return this.versionBeingEditedNumber != null;
  }
}
