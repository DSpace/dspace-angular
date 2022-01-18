import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RowComponent } from './row.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../../shared/mocks/translate-loader.mock';
import { TextComponent } from '../rendering-types/text/text.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../../../core/shared/item.model';
import { metadataBoxConfigurationMock } from 'src/app/shared/testing/box-configurations.mock';
import { By } from '@angular/platform-browser';

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
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [
        RowComponent,
        TextComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
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
