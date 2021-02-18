import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { ItemExportAlertComponent } from './item-export-alert.component';
import { Component, Input } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { ItemExportFormatMolteplicity } from '../../../core/itemexportformat/item-export-format.service';

describe('ItemExportAlertComponent', () => {
  let component: ItemExportAlertComponent;
  let fixture: ComponentFixture<ItemExportAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        TranslateModule.forRoot({ loader: { provide: TranslateLoader,  useClass: TranslateLoaderMock }})
      ],
      providers: [ DSONameService ],
      declarations: [ItemExportAlertComponent]
    })
      .compileComponents();
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

@Component({ selector: 'ds-item-export-alert', template: ''})
export class ItemExportAlertStubComponent {
  @Input() molteplicity: ItemExportFormatMolteplicity;
  @Input() item: Item;
}
