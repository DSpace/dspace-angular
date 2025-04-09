import {
  AsyncPipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { ExternalSourceDataService } from '../../core/data/external-source-data.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { ExternalSourceEntry } from '../../core/shared/external-source-entry.model';
import { Item } from '../../core/shared/item.model';
import { MetadatumViewModel } from '../../core/shared/metadata.models';
import { Metadata } from '../../core/shared/metadata.utils';
import {
  getFinishedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { SubmissionObject } from '../../core/submission/models/submission-object.model';
import { SubmissionObjectDataService } from '../../core/submission/submission-object-data.service';
import { AlertComponent } from '../alert/alert.component';
import { ThemedCreateItemParentSelectorComponent } from '../dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import { ThemedLoadingComponent } from '../loading/themed-loading.component';
import { NotificationsService } from '../notifications/notifications.service';
import { createFailedRemoteDataObject } from '../remote-data.utils';
import { followLink } from '../utils/follow-link-config.model';

@Component({
  selector: 'ds-vocabulary-external-source',
  templateUrl: './vocabulary-external-source.component.html',
  styleUrls: ['./vocabulary-external-source.component.scss'],
  imports: [
    AlertComponent,
    NgIf,
    AsyncPipe,
    TranslateModule,
    NgForOf,
    ThemedLoadingComponent,
  ],
  standalone: true,
})
export class VocabularyExternalSourceComponent implements OnInit {

  @Input() entityType: string;
  @Input() externalSourceIdentifier: string;
  @Input() submissionObjectID: string;
  @Input() metadataPlace: string;

  /**
   * The external source entry
   */
  private externalSourceEntry: ExternalSourceEntry;

  /**
   * The entry metadata list
   */
  public metadataList: MetadatumViewModel[];

  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private modalRef: NgbModalRef;

  /**
   * The the source item uuid
   */
  private sourceItemUUID$: Observable<string>;

  /**
   * Event emitted when new entity is created with its UUID
   */
  @Output() updateAuthority: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private activeModal: NgbActiveModal,
    private externalSourceService: ExternalSourceDataService,
    private itemService: ItemDataService,
    private modalService: NgbModal,
    private notificationService: NotificationsService,
    private submissionObjectService: SubmissionObjectDataService,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.loading$.next(true);

    this.sourceItemUUID$ = this.getItemUUIDFromSubmissionObject();

    this.sourceItemUUID$.pipe(
      switchMap((itemUUID) => {
        const externalSourceId = itemUUID + ':' + this.metadataPlace;
        return this.externalSourceService.getExternalSourceEntryById(
          this.externalSourceIdentifier,
          externalSourceId,
        );
      }),
      getFinishedRemoteData(),
      catchError((err: unknown) => {
        console.error(err);
        return observableOf(createFailedRemoteDataObject(null));
      }),
    ).subscribe((externalSourceRD: RemoteData<ExternalSourceEntry>) => {
      if (externalSourceRD.hasSucceeded) {
        const externalSource = externalSourceRD.payload;
        this.metadataList = Metadata.toViewModelList(externalSource.metadata);
        this.externalSourceEntry = externalSource;
      } else {
        this.metadataList = [];
      }
      this.loading$.next(false);
    });
  }

  /**
   * Start the import of an entry by opening up a collection choice modal window.
   */
  public import(): void {
    this.modalRef = this.modalService.open(ThemedCreateItemParentSelectorComponent, {
      size: 'lg',
    });
    this.modalRef.componentInstance.entityType = this.entityType;
    this.modalRef.componentInstance.emitOnly = true;

    this.modalRef.componentInstance.select.pipe(take(1)).subscribe((collection: Collection) => {
      this.loading$.next(true);
      this.createEntityFromExternalSource(this.externalSourceEntry, collection.uuid);
    });
  }

  /**
   * Closes the modal.
   */
  public closeModal(): void {
    this.activeModal.dismiss();
  }

  private getItemUUIDFromSubmissionObject(): Observable<string> {
    return this.submissionObjectService.findById(this.submissionObjectID, false, true, followLink('item')).pipe(
      getFirstSucceededRemoteDataPayload(),
      switchMap((submissionObject: SubmissionObject) => (submissionObject.item as Observable<RemoteData<Item>>)
        .pipe(
          getFirstSucceededRemoteDataPayload(),
        ),
      ),
      map((item: Item) => item.uuid),
      take(1),
    );
  }

  private createEntityFromExternalSource(externalSourceEntry: ExternalSourceEntry, collectionId: string) {
    this.itemService.importExternalSourceEntry(externalSourceEntry, collectionId).pipe(
      getFinishedRemoteData(),
    ).subscribe((rd: RemoteData<Item>) => {
      if (rd.hasSucceeded) {
        this.notificationService.success(
          null,
          this.translate.instant('vocabulary.import-external.preview.import.success'),
        );
        this.updateAuthority.emit(rd.payload.uuid);
      } else {
        this.notificationService.error(
          null,
          this.translate.instant('vocabulary.import-external.preview.import.error'),
        );
      }
      this.closeModal();
    });
  }
}
