import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrisLayoutRelationBoxComponent } from './cris-layout-relation-box.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../shared/shared.module';
import { Item } from '../../../../../core/shared/item.model';
import { of } from 'rxjs';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';

describe('CrisLayoutRelationBoxComponent', () => {
  let component: CrisLayoutRelationBoxComponent;
  let fixture: ComponentFixture<CrisLayoutRelationBoxComponent>;

  const testItem = Object.assign(new Item(), {
    id: '1234-65487-12354-1235',
    bundles: of({}),
    metadata: {}
  });

  const testBox = Object.assign(new CrisLayoutBox(), {
    id: '1',
    collapsed: false,
    header: 'CrisLayoutBox Header',
    shortname: 'test-box',
    configuration: of({ configuration: 'box-configuration-id' })
  });

  beforeEach(waitForAsync(() => {
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
      declarations: [ CrisLayoutRelationBoxComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: 'boxProvider', useClass: testBox },
        { provide: 'itemProvider', useClass: testItem },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutRelationBoxComponent);
    component = fixture.componentInstance;
    component.box = testBox;
    component.item = testItem;
    fixture.detectChanges();
  });

  xit('should have set scope in searchFilter', () => {
    expect(component.searchFilter).toContain('scope=' + testItem.id);
  });
});
