import {
  AsyncPipe,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  NgbDropdownModule,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import {
  map,
  startWith,
} from 'rxjs/operators';

import { getEditItemPageRoute } from '../../../app-routing-paths';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import {
  getAllSucceededRemoteDataPayload,
  getPaginatedListPayload,
} from '../../../core/shared/operators';
import { EditItemDataService } from '../../../core/submission/edititem-data.service';
import { EditItemMode } from '../../../core/submission/models/edititem-mode.model';
import {
  hasValue,
  isNotEmpty,
} from '../../empty.util';
import { NotificationsService } from '../../notifications/notifications.service';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';

/**
 * This component renders a context menu option that provides the links to edit item page.
 */
@Component({
  selector: 'ds-context-menu-edit-item',
  templateUrl: './edit-item-menu.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgbDropdownModule,
    RouterLink,
    AsyncPipe,
    TranslateModule,
  ],
})
export class EditItemMenuComponent extends ContextMenuEntryComponent implements OnInit, OnDestroy {

  /**
   * The menu entry type
   */
  public static menuEntryType: ContextMenuEntryType = ContextMenuEntryType.EditSubmission;

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  isEditAvailable$: Observable<boolean>;

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * List of Edit Modes available on this item
   * for the current user
   */
  editModes$: BehaviorSubject<EditItemMode[]> = new BehaviorSubject<EditItemMode[]>([]);

  /**
   * Variable to track subscription and unsubscribe it onDestroy
   */
  private sub: Subscription;


  /**
   * Initialize instance variables
   *
   * @param {DSpaceObject} injectedContextMenuObject
   * @param {DSpaceObjectType} injectedContextMenuObjectType
   * @param {EditItemDataService} editItemService
   * @param notificationService
   */
  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private editItemService: EditItemDataService,
    public notificationService: NotificationsService,
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EditSubmission);
  }

  ngOnInit(): void {
    this.notificationService.claimedProfile.subscribe(() => {
      this.getData();
    });

    this.isEditAvailable$ = this.editModes$.pipe(
      map((editModes) => isNotEmpty(editModes) && editModes.length > 0),
    );
  }

  /**
   * Check if edit mode is available
   */
  getEditModes(): Observable<EditItemMode[]> {
    return this.editModes$;
  }

  /**
   * Check if edit mode is available
   */
  isEditAvailable(): Observable<boolean> {
    return this.editModes$.asObservable().pipe(
      map((editModes) => isNotEmpty(editModes) && editModes.length > 0),
    );
  }

  /**
   * Make sure the subscription is unsubscribed from when this component is destroyed
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
  getData(): void {
    this.sub = this.editItemService.searchEditModesById(this.contextMenuObject.id).pipe(
      getAllSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      startWith([]),
    ).subscribe((editModes: EditItemMode[]) => {
      this.editModes$.next(editModes);
    });
  }

  getEditItemRoute() {
    return getEditItemPageRoute();
  }
}
