import { NgIf } from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../core/shared/item.model';
import { AlertComponent } from '../../../alert/alert.component';

@Component({
  selector: 'ds-item-export-alert',
  templateUrl: './item-export-alert.component.html',
  imports: [
    AlertComponent,
    NgIf,
    TranslateModule,
  ],
  standalone: true,
})
export class ItemExportAlertComponent {

  @Input() item: Item;
  @Input() entityType: string;
  @Input() bulkExportLimit: string;

  constructor(private dsoNameService: DSONameService) {
  }

  getItemName() {
    return this.dsoNameService.getName(this.item);
  }

}
