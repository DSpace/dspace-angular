import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { BulkAccessSettingsComponent } from './settings/bulk-access-settings.component';
import { BulkAccessControlService } from '../../shared/access-control-form-container/bulk-access-control.service';
import { SelectableListState } from '../../shared/object-list/selectable-list/selectable-list.reducer';
import { SelectableListService } from '../../shared/object-list/selectable-list/selectable-list.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { RemoteData } from '../../core/data/remote-data';
import { Process } from '../../process-page/processes/process.model';
import { isNotEmpty } from '../../shared/empty.util';
import { getProcessDetailRoute } from '../../process-page/process-page-routing.paths';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-bulk-access',
  templateUrl: './bulk-access.component.html',
  styleUrls: ['./bulk-access.component.scss']
})
export class BulkAccessComponent implements OnInit {

  /**
   * The selection list id
   */
  listId = 'bulk-access-list';

  /**
   * The list of the objects already selected
   */
  objectsSelected$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   */
  private subs: Subscription[] = [];

  /**
   * The SectionsDirective reference
   */
  @ViewChild('dsBulkSettings') settings: BulkAccessSettingsComponent;

  constructor(
    private bulkAccessControlService: BulkAccessControlService,
    private notificationsService: NotificationsService,
    private router: Router,
    private selectableListService: SelectableListService,
    private translationService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.selectableListService.getSelectableList(this.listId).pipe(
        distinctUntilChanged(),
        map((list: SelectableListState) => this.generateIdListBySelectedElements(list))
      ).subscribe(this.objectsSelected$)
    );
  }

  canExport(): boolean {
    return this.objectsSelected$.value?.length > 0;
  }

  /**
   * Reset the form to its initial state
   * This will also reset the state of the child components (bitstream and item access)
   */
  reset(): void {
    this.settings.reset();
  }

  /**
   * Submit the form
   * This will create a payload file and execute the script
   */
  submit(): void {
    const settings = this.settings.getValue();
    const bitstreamAccess = settings.bitstream;
    const itemAccess = settings.item;

    const { file } = this.bulkAccessControlService.createPayloadFile({
      bitstreamAccess,
      itemAccess,
      state: settings.state
    });

    this.bulkAccessControlService.executeScript(
      this.objectsSelected$.value || [],
      file
    ).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<Process>) => {
        if (rd.hasSucceeded) {
          const title = this.translationService.get('process.new.notification.success.title');
          const content = this.translationService.get('process.new.notification.success.content');
          this.notificationsService.success(title, content);
          if (isNotEmpty(rd.payload)) {
            this.router.navigateByUrl(getProcessDetailRoute(rd.payload.processId));
          }
          return true;
        } else {
          const title = this.translationService.get('process.new.notification.error.title');
          const content = this.translationService.get('process.new.notification.error.content');
          this.notificationsService.error(title, content);
          return false;
        }
      })).subscribe();
  }

  /**
   * Generate The RemoteData object containing the list of the selected elements
   * @param list
   * @private
   */
  private generateIdListBySelectedElements(list: SelectableListState): string[] {
    return list?.selection?.map((entry: any) => entry.indexableObject.uuid);
  }
}
