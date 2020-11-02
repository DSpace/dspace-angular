import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ItemExportFormatMolteplicity, ItemExportFormatService } from 'src/app/core/itemexportformat/item-export.service';
import { Item } from 'src/app/core/shared/item.model';
import { isEmpty } from 'src/app/shared/empty.util';

@Component({
  selector: 'ds-item-export',
  templateUrl: './item-export.component.html',
  styleUrls: ['./item-export.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemExportComponent implements OnInit {

  @Input() item: Item;

  public formats: string[];
  private entityType: string;

  constructor(private itemExportFormatService: ItemExportFormatService,
    private router: Router,
    private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.item);
    this.entityType = this.item.firstMetadataValue('relationship.type');
    if (isEmpty(this.entityType)) {
      throw Error('cannot get item entityType');
    }
    this.itemExportFormatService.byEntityTypeAndMolteplicity(this.entityType, ItemExportFormatMolteplicity.SINGLE).pipe(take(1))
      .subscribe(values => {
        this.formats = values.payload.page.map(value => value.id);
        this._cd.detectChanges();
      });
  }

  onSelectFormat(format) {
    this.doExport(this.item.uuid, format);
  }

  /**
   * Starts import-metadata script with -e currentUserEmail -f fileName (and the selected file)
   */
  private doExport(uuid: string, format: string): any {
    this.itemExportFormatService.doExport(uuid, format).subscribe(processNumber => {
      if (processNumber !== null) {
        this.router.navigateByUrl('/processes/' + processNumber);
      }
    })
  }

}
