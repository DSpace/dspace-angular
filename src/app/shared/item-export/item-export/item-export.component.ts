import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { take } from 'rxjs/operators';
import { Item } from '../../../core/shared/item.model';
import { SearchOptions } from '../../search/search-options.model';
import { ItemExportFormConfiguration, ItemExportService } from '../item-export.service';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';

@Component({
  selector: 'ds-item-export',
  templateUrl: './item-export.component.html'
})
export class ItemExportComponent implements OnInit {

  @Input() molteplicity: ItemExportFormatMolteplicity;
  @Input() item: Item;
  @Input() searchOptions: SearchOptions;

  public configuration: ItemExportFormConfiguration;
  public exportForm: FormGroup;

  constructor(protected itemExportService: ItemExportService,
              protected router: Router,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.itemExportService.initialItemExportFormConfiguration(this.item).pipe(take(1))
      .subscribe((configuration: ItemExportFormConfiguration) => {
        this.configuration = configuration;
        this.exportForm = this.initForm(configuration);

        // listen for entityType selections in order to update the available formats
        this.exportForm.controls.entityType.valueChanges.subscribe((entityType) => {
          this.onEntityTypeChange(entityType);
        });
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

  onSubmit() {
    if (this.exportForm.valid) {
      this.itemExportService.submitForm(
        this.molteplicity,
        this.item,
        this.searchOptions,
        this.exportForm.value.entityType,
        this.exportForm.value.format).pipe(take(1)).subscribe((processNumber) => {

        this.routeToProcess(processNumber);
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
