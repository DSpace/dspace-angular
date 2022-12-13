import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, switchMap, take } from 'rxjs/operators';
import { Item } from '../../../../core/shared/item.model';
import { ItemType } from '../../../../core/shared/item-relationships/item-type.model';
import { SearchOptions } from '../../models/search-options.model';
import { ItemExportFormConfiguration, ItemExportService } from '../item-export.service';
import { ItemExportFormatMolteplicity } from '../../../../core/itemexportformat/item-export-format.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ItemExportFormat } from '../../../../core/itemexportformat/model/item-export-format.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { isNotEmpty } from '../../../empty.util';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SelectableListService } from '../../../object-list/selectable-list/selectable-list.service';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { SelectableListState } from '../../../object-list/selectable-list/selectable-list.reducer';
import { SearchResult } from '../../models/search-result.model';

export enum ExportSelectionMode {
  All = 'all',
  OnlySelection = 'onlySelection'
}

@Component({
  selector: 'ds-item-export',
  templateUrl: './item-export.component.html'
})
export class ItemExportComponent implements OnInit, OnDestroy {

  /**
   * Export format suitable for bulk import
   */
  public static BULK_IMPORT_READY_XLS = 'collection-xls';

  @Input() molteplicity: ItemExportFormatMolteplicity;
  @Input() item: Item;
  @Input() searchOptions: SearchOptions;
  @Input() itemType: ItemType;

  public configuration: ItemExportFormConfiguration;
  public exportForm: FormGroup;

  /**
   * When true, show collection selector
   */
  selectCollection = false;

  /**
   * The selected entity type.
   * This is used by ds-administered-collection-selector when the "bulk import ready" format has been chosen.
   */
  selectedEntityType: string;

  /**
   * The UUID of the selected collection. This is needed by the "bulk import ready" format.
   */
  bulkImportXlsEntityTypeCollectionUUID: string;

  /**
   * This is used by ds-administered-collection-selector when the "bulk import ready" format has been chosen.
   */
  bulkImportXlsCollectionSelector = [DSpaceObjectType.COLLECTION];

  /**
   * When true, export configurations have been loaded and the select field can be shown.
   */
  configurationLoaded = false;

  exportSelectionMode: BehaviorSubject<ExportSelectionMode> = new BehaviorSubject<ExportSelectionMode>(ExportSelectionMode.All);

  currentUrl: string;

  listId = 'export-list';

  constructor(
    protected itemExportService: ItemExportService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    public activeModal: NgbActiveModal,
    private selectableListService: SelectableListService,) {
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.itemExportService.initialItemExportFormConfiguration(this.item).pipe(take(1))
      .subscribe((configuration: ItemExportFormConfiguration) => {
        this.configuration = configuration;
        this.configurationLoaded = true;

        if (!!this.item) {
          this.exportForm = this.initForm(configuration);
        } else if (!!this.itemType) {
          this.exportForm = this.initFormItemType(configuration);
          this.onEntityTypeChange(this.itemType.label);
          this.exportForm.controls.selectionMode.valueChanges.subscribe((selectionMode) => {
            this.showSelectionList(selectionMode);
          });
        } else {
          this.exportForm = this.initForm(configuration);
          this.onEntityTypeChange(configuration.entityType);
          // listen for entityType selections in order to update the available formats
          this.exportForm.controls.entityType.valueChanges.subscribe((entityType) => {
            this.onEntityTypeChange(entityType);
          });
          this.exportForm.controls.selectionMode.valueChanges.subscribe((selectionMode) => {
            this.showSelectionList(selectionMode);
          });
        }
      });
  }

  onEntityTypeChange(entityType: string) {
    this.configurationLoaded = false;
    this.itemExportService.onSelectEntityType(this.configuration.entityTypes, entityType).pipe(take(1)).subscribe((configuration) => {
      this.configuration = configuration;

      // Add a new Excel export format suitable for bulk import
      this.selectedEntityType = entityType;
      const xlsConfigurationFormat: ItemExportFormat = Object.assign(new ItemExportFormat(), {
        type: 'itemexportformat',
        id: ItemExportComponent.BULK_IMPORT_READY_XLS,
        mimeType: 'application/vnd.ms-excel',
        entityType: entityType,
        molteplicity: 'MULTIPLE',
      });
      this.configuration.formats.push(xlsConfigurationFormat);

      this.exportForm.controls.format.patchValue(this.configuration.format);

      this.configurationLoaded = true;
    });
  }

  initForm(configuration: ItemExportFormConfiguration): FormGroup {
    return new FormGroup({
      format: new FormControl(configuration.format, [Validators.required]),
      entityType: new FormControl(configuration.entityType, [Validators.required])
    });
  }

  initFormItemType(configuration: ItemExportFormConfiguration): FormGroup {
    return new FormGroup({
      format: new FormControl(configuration.format, [Validators.required]),
      entityType: new FormControl({ value: this.itemType.label, disabled: true }, [Validators.required]),
      selectionMode: new FormControl(this.exportSelectionMode.value, [Validators.required]),
    });
  }

  isFormValid(): Observable<boolean> {
    if (this.exportForm?.value?.selectionMode === ExportSelectionMode.OnlySelection) {
      return this.selectableListService.getSelectableList(this.listId).pipe(
        map((list: SelectableListState) => list?.selection?.length > 0)
      );
    } else {
      return of(this.exportForm.valid);
    }
  }

  onCollectionSelect(collection) {
    this.bulkImportXlsEntityTypeCollectionUUID = collection.uuid;
    this.selectCollection = true;
  }


  onSubmit() {
    if (this.exportForm.valid) {
      console.log(`${this.exportForm.value.format.id} === ${ItemExportComponent.BULK_IMPORT_READY_XLS}`);
      if (!!this.exportForm.value.format.id && this.exportForm.value.format.id === ItemExportComponent.BULK_IMPORT_READY_XLS && !this.selectCollection) {
        // if the "bulk import" format has been chosen, show the collection selection form
        this.selectCollection = true;
      } else {
        // select the collection and submit
        if (isNotEmpty(this.bulkImportXlsEntityTypeCollectionUUID)) {
          this.searchOptions.query = `location.coll:${this.bulkImportXlsEntityTypeCollectionUUID}`;
          this.searchOptions.scope = this.bulkImportXlsEntityTypeCollectionUUID;
        }

        const list$: Observable<string[]> = (this.exportForm?.value?.selectionMode !== ExportSelectionMode.OnlySelection) ?
          of([]) :
          this.selectableListService.getSelectableList(this.listId).pipe(
            take(1),
            map((list: SelectableListState) => (list?.selection || []).map((entry: SearchResult<any>) => entry.indexableObject.id))
          );
        console.log(this.searchOptions);
        list$.pipe(
          switchMap((list: string[]) => this.itemExportService.submitForm(
            this.molteplicity,
            this.item,
            this.searchOptions,
            this.itemType ? this.exportForm.controls.entityType.value : this.exportForm.value.entityType,
            this.exportForm.value.format,
            list
          ))
        ).pipe(take(1)).subscribe((processId) => {
          const title = this.translate.get('item-export.process.title');
          this.notificationsService.process(processId.toString(), 5000, title);

          this.selectCollection = false;
          this.selectedEntityType = undefined;
          this.bulkImportXlsEntityTypeCollectionUUID = undefined;

          this.activeModal.close();
        });
      }
    }
  }

  routeToProcess(processNumber: number) {
    if (processNumber !== null) {
      this.router.navigateByUrl('/processes/' + processNumber).then();
    }
  }

  private showSelectionList(selectionMode: any) {
    this.exportSelectionMode.next(selectionMode);
  }

  ngOnDestroy(): void {
    this.router.navigateByUrl(this.currentUrl);
  }
}
