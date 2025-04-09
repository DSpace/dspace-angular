import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { metadataBoxConfigurationMock } from 'src/app/shared/testing/box-configurations.mock';

import { Item } from '../../../../../../core/shared/item.model';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';
import { TextComponent } from '../rendering-types/text/text.component';
import { MetadataContainerComponent } from './metadata-container/metadata-container.component';
import { RowComponent } from './row.component';

class TestItem {
  firstMetadataValue(key: string): string {
    return 'Item';
  }
}

describe('RowComponent', () => {
  let component: RowComponent;
  let fixture: ComponentFixture<RowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), RowComponent,
      TextComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(RowComponent, { remove: { imports: [MetadataContainerComponent] } }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowComponent);
    component = fixture.componentInstance;
    component.item = new TestItem() as Item;
    component.row = metadataBoxConfigurationMock.rows[0];
    fixture.detectChanges();
  });


  it('should render a div for each cell', () => {
    const divValueFound = fixture.debugElement.queryAll(By.css('.metadata-cell'));
    expect(divValueFound.length).toBe(2);
  });

  it('should render a metdata container for each field', () => {
    let divValueFound = fixture.debugElement.query(By.css('.metadata-cell:nth-child(1)'));
    let metadataFound = divValueFound.queryAll(By.css('ds-metadata-container'));
    expect(metadataFound.length).toBe(1);

    divValueFound = fixture.debugElement.query(By.css('.metadata-cell:nth-child(2)'));
    metadataFound = divValueFound.queryAll(By.css('ds-metadata-container'));
    expect(metadataFound.length).toBe(5);
  });

});
