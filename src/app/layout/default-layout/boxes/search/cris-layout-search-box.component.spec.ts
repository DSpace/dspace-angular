import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisLayoutSearchBoxComponent } from './cris-layout-search-box.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Item } from 'src/app/core/shared/item.model';
import { of } from 'rxjs';
import { Box } from 'src/app/core/layout/models/box.model';
import { TranslateLoaderMock } from 'src/app/shared/mocks/translate-loader.mock';

describe('CrisLayoutSearchBoxComponent', () => {
  let component: CrisLayoutSearchBoxComponent;
  let fixture: ComponentFixture<CrisLayoutSearchBoxComponent>;

  const testItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {}
  });

  const testBox = Object.assign(new Box(), {
    id: '1',
    collapsed: false,
    header: 'Box Header',
    shortname: 'test-box',
    configuration: of({ configuration: 'box-configuration-id' })
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        CommonModule,
        SharedModule
      ],
      declarations: [ CrisLayoutSearchBoxComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutSearchBoxComponent);
    component = fixture.componentInstance;
    component.box = testBox;
    component.item = testItem;
    fixture.detectChanges();
  });

  it('should have set scope in searchFilter', () => {
    expect(component.searchFilter).toContain('scope=' + testItem.id);
  });
});
