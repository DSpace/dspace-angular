import {
  Component,
  Input,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { ItemExportFormatMolteplicity } from '@dspace/core/itemexportformat/item-export-format.service';
import { Item } from '@dspace/core/shared/item.model';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { AlertComponent } from '../../../alert/alert.component';
import { ItemExportAlertComponent } from './item-export-alert.component';

describe('ItemExportAlertComponent', () => {
  let component: ItemExportAlertComponent;
  let fixture: ComponentFixture<ItemExportAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: TranslateLoaderMock } }),
        ItemExportAlertComponent,
      ],
      providers: [DSONameService],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(ItemExportAlertComponent, { remove: { imports: [AlertComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemExportAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});

@Component({ selector: 'ds-item-export-alert', template: '' })
export class ItemExportAlertStubComponent {
  @Input() molteplicity: ItemExportFormatMolteplicity;
  @Input() item: Item;
  @Input() bulkExportLimit: string;
}
