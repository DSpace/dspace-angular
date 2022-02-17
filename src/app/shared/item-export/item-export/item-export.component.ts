import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { Item } from '../../../core/shared/item.model';
import { ItemType } from '../../../core/shared/item-relationships/item-type.model';
import { SearchOptions } from '../../search/models/search-options.model';
import { ItemExportFormConfiguration, ItemExportService } from '../item-export.service';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-item-export',
  templateUrl: './item-export.component.html'
})
export class ItemExportComponent implements OnInit {

  @Input() molteplicity: ItemExportFormatMolteplicity;
  @Input() item: Item;
  @Input() searchOptions: SearchOptions;
  @Input() itemType: ItemType;

  public configuration: ItemExportFormConfiguration;
  public exportForm: FormGroup;

  constructor(protected itemExportService: ItemExportService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.itemExportService.initialItemExportFormConfiguration(this.item).pipe(take(1))
      .subscribe((configuration: ItemExportFormConfiguration) => {
        this.configuration = configuration;
        if (!!this.itemType) {
          this.exportForm = this.initFormItemType(configuration);
          this.onEntityTypeChange(this.itemType.label);
        } else {
          this.exportForm = this.initForm(configuration);
          // listen for entityType selections in order to update the available formats
          this.exportForm.controls.entityType.valueChanges.subscribe((entityType) => {
            this.onEntityTypeChange(entityType);
          });
        }
      });
  }

  onEntityTypeChange(entityType: string) {
    this.itemExportService.onSelectEntityType(this.configuration.entityTypes, entityType).pipe(take(1)).subscribe((configuration) => {
      this.configuration = configuration;
      this.exportForm.controls.format.patchValue(this.configuration.format);
    });
  }

  initForm(configuration: ItemExportFormConfiguration): FormGroup {
    return new FormGroup({
      format: new FormControl(configuration.format, [Validators.required]),
      entityType: new FormControl(configuration.entityType, [Validators.required]),
    });
  }

  initFormItemType(configuration: ItemExportFormConfiguration): FormGroup {
    return new FormGroup({
      format: new FormControl(configuration.format, [Validators.required]),
      entityType: new FormControl({ value: this.itemType.label, disabled: true }, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.exportForm.valid) {


      this.itemExportService.submitForm(
        this.molteplicity,
        this.item,
        this.searchOptions,
        this.itemType ? this.exportForm.controls.entityType.value : this.exportForm.value.entityType,
        this.exportForm.value.format).pipe(take(1)).subscribe((processId) => {

          const title = this.translate.get('item-export.process.title');
          this.notificationsService.process(processId.toString(), 5000, title);

          this.activeModal.close();
        });
    }
  }

  routeToProcess(processNumber: number) {
    if (processNumber !== null) {
      this.router.navigateByUrl('/processes/' + processNumber).then();
    }
  }

}
