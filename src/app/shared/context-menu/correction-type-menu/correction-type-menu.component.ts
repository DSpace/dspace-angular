import { getAllSucceededRemoteDataPayload, getPaginatedListPayload } from './../../../core/shared/operators';
import { CorrectionTypeDataService } from './../../../core/submission/correctiontype-data.service';
import { DSpaceObject } from './../../../core/shared/dspace-object.model';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ContextMenuEntryComponent } from '../context-menu-entry.component';
import { ContextMenuEntryType } from '../context-menu-entry-type';
import { BehaviorSubject, Observable, Subscription, map, startWith, tap } from 'rxjs';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CorrectionTypeMode } from '../../../core/submission/models/correction-type-mode.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { hasValue, isNotEmpty } from '../../empty.util';
import { rendersContextMenuEntriesForType } from '../context-menu.decorator';
import { getCorrectionTypePageRoute } from '../../../app-routing-paths';

@Component({
  selector: 'ds-correction-type-menu',
  templateUrl: './correction-type-menu.component.html',
})
@rendersContextMenuEntriesForType(DSpaceObjectType.ITEM)
export class CorrectionTypeMenuComponent extends ContextMenuEntryComponent implements OnInit, OnDestroy {

  /**
   * The menu entry type
   */
  public static menuEntryType: ContextMenuEntryType = ContextMenuEntryType.CorrectionType;

  /**
   * A boolean representing if a request operation is pending
   * @type {BehaviorSubject<boolean>}
   */
  public processing$ = new BehaviorSubject<boolean>(false);

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  /**
   * List of Edit Modes available on this item
   * for the current user
   */
  private correctionTypes$: BehaviorSubject<CorrectionTypeMode[]> = new BehaviorSubject<CorrectionTypeMode[]>([]);

  /**
   * Variable to track subscription and unsubscribe it onDestroy
   */
  private sub: Subscription;

  constructor(
    @Inject('contextMenuObjectProvider') protected injectedContextMenuObject: DSpaceObject,
    @Inject('contextMenuObjectTypeProvider') protected injectedContextMenuObjectType: DSpaceObjectType,
    private correctionTypeService: CorrectionTypeDataService,
    public notificationService: NotificationsService
  ) {
    super(injectedContextMenuObject, injectedContextMenuObjectType, ContextMenuEntryType.EditSubmission);
  }

  ngOnInit(): void {
    this.notificationService.claimedProfile.subscribe(() => {
      this.getData();
    });
  }

  /**
   * Check if edit mode is available
   */
  getCorrectionTypes(): Observable<CorrectionTypeMode[]> {
    return this.correctionTypes$;
  }

  /**
   * Check if edit mode is available
   */
  isAvailable(): Observable<boolean> {
    return this.correctionTypes$.asObservable().pipe(
      map((type) => isNotEmpty(type) && type.length > 0)
    );
  }

  getData(): void {
    this.sub = this.correctionTypeService.findByItem(this.contextMenuObject.id, true).pipe(
      tap((types) => console.log(types)),
      getAllSucceededRemoteDataPayload(),
      getPaginatedListPayload(),
      startWith([])
    ).subscribe((types: CorrectionTypeMode[]) => {
      console.log(types);
      this.correctionTypes$.next(types);
    });
  }

  getTypeRoute(id: string) {
    return getCorrectionTypePageRoute(this.contextMenuObject.id, id);
  }

  /**
    * Make sure the subscription is unsubscribed from when this component is destroyed
    */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
