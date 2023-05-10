import { Component, OnInit, ViewChild } from '@angular/core';

import { BulkAccessSettingsComponent } from './settings/bulk-access-settings.component';
import { distinctUntilChanged, map, take, tap } from 'rxjs/operators';
import { BulkAccessControlService } from '../../shared/access-control-form-container/bulk-access-control.service';
import { SelectableListState } from '../../shared/object-list/selectable-list/selectable-list.reducer';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SelectableListService } from '../../shared/object-list/selectable-list/selectable-list.service';

@Component({
  selector: 'ds-bulk-access',
  // templateUrl: './bulk-access.component.html',
  template: `<div class="container">
    <ds-bulk-access-browse [listId]="listId"></ds-bulk-access-browse>
    <div class="clearfix mb-3"></div>
    <ds-bulk-access-settings #dsBulkSettings ></ds-bulk-access-settings>

    <hr>

    <div class="d-flex justify-content-end">
      <button class="btn btn-outline-primary mr-3" (click)="reset()">
        {{ 'access-control-reset' | translate }}
      </button>
      <button class="btn btn-primary" [disabled]="!canExport()" (click)="submit()">
        {{ 'access-control-execute' | translate }}
      </button>
    </div>
  </div>`,
  styleUrls: ['./bulk-access.component.scss']
})
export class BulkAccessComponent implements OnInit {


  /**
   * The selection list id
   */
  listId: string = 'bulk-access-list';

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
    private selectableListService: SelectableListService
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.selectableListService.getSelectableList(this.listId).pipe(
        distinctUntilChanged(),
        tap(console.log),
        map((list: SelectableListState) => this.generateIdListBySelectedElements(list)),
        tap(console.log)
      ).subscribe(this.objectsSelected$)
    )
  }

  canExport(): boolean {
    return this.objectsSelected$.value?.length > 0;
  }

  /**
   * Reset the form to its initial state
   * This will also reset the state of the child components (bitstream and item access)
   */
  reset(): void {
    this.settings.reset()
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
    ).pipe(take(1)).subscribe((res) => {
      console.log('success', res);
    });
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
