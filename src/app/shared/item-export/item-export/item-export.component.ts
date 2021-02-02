import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import {
  ItemExportFormatMolteplicity,
  ItemExportFormatService
} from '../../../core/itemexportformat/item-export.service';
import { ItemExportFormat } from '../../../core/itemexportformat/model/item-export-format.model';
import { Item } from '../../../core/shared/item.model';
import { isEmpty } from '../../empty.util';
import { SearchOptions } from '../../search/search-options.model';

@Component({
  selector: 'ds-item-export',
  templateUrl: './item-export.component.html'
})
export class ItemExportComponent implements OnInit {

  @Input() molteplicity: ItemExportFormatMolteplicity;
  @Input() item: Item;
  @Input() searchOptions: SearchOptions;

  public allEntityTypes: string[] = [];
  public allFormats: ItemExportFormat[] = [];
  public exportForm: FormGroup;

  constructor(private itemExportFormatService: ItemExportFormatService,
              private router: Router,
              public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    if (this.item) {
      this.initializeSingleExport();
    }

    if (this.searchOptions) {
      this.initializeMultipleExport();
    }
  }

  onSubmit() {
    if (this.exportForm.valid) {
      const format = this.exportForm.value.format;
      if (this.molteplicity === ItemExportFormatMolteplicity.SINGLE) {
        this.itemExportFormatService.doExport(this.item.uuid, format).subscribe((processNumber) => {
          this.routeToProcess(processNumber);
        });
      } else {
        const entityType = this.exportForm.value.entityType;
        this.itemExportFormatService.doExportMulti(entityType, format, this.searchOptions).subscribe((processNumber) => {
          this.routeToProcess(processNumber);
        });
      }
      this.activeModal.close();
    }
  }

  private routeToProcess(processNumber: number) {
    if (processNumber !== null) {
      this.router.navigateByUrl('/processes/' + processNumber);
    }
  }

  private initializeSingleExport() {
    const entityType = this.item.firstMetadataValue('relationship.type');
    if (isEmpty(entityType)) {
      throw Error('cannot get item entityType');
    }
    this.exportForm = new FormGroup({
      format: new FormControl(null, [Validators.required]),
    });
    this.fetchFormats(entityType).subscribe();
  }

  private initializeMultipleExport() {
    this.exportForm = new FormGroup({
      entityType: new FormControl(null, [Validators.required]),
      format: new FormControl(null, [Validators.required]),
    });

    this.fetchEntityTypes().subscribe(() => {

      // listen for entityType selections in order to update the available formats
      this.exportForm.controls.entityType.valueChanges.subscribe((entityType) => {
        this.fetchFormats(entityType).subscribe();
      });
    });
  }

  private fetchEntityTypes(): Observable<any> {
    return this.itemExportFormatService.byEntityTypeAndMolteplicity(null, this.molteplicity).pipe(
      take(1),
      tap((values) => {
        this.allEntityTypes = Object.keys(values);
      }));
  }

  private fetchFormats(entityType): Observable<any> {
    return this.itemExportFormatService.byEntityTypeAndMolteplicity(entityType, this.molteplicity).pipe(
      take(1),
      tap((values) => {
        this.exportForm.controls.format.patchValue(null);
        this.allFormats = entityType ? values[entityType] : [];
      }));
  }

  // HELPERS

  // private populateEntityTypes() {
  //   const filtersSubscribe = this.searchConfigService.searchOptions.pipe(
  //     switchMap((options) => this.searchService.getConfig(options.scope, options.configuration).pipe(getSucceededRemoteData())),
  //   ).subscribe(response => {
  //     const entityTypeFilter = (<SearchFilterConfig[]>response.payload).filter(filter => filter.name === 'entityType')[0];
  //     this.searchService.getFacetValuesFor(entityTypeFilter, 1, this.searchOptions).pipe(take(1)).subscribe(entityTypes => {
  //       this.entityTypes = entityTypes.payload.page.map(facet => facet.value);
  //     })
  //   });
  // }

}
