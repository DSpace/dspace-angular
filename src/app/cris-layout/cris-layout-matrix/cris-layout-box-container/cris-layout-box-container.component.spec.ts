import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { CrisLayoutBoxContainerComponent } from './cris-layout-box-container.component';
import { TranslateLoaderMock } from '../../../shared/mocks/translate-loader.mock';
import { boxMetadata } from '../../../shared/testing/box.mock';
import { Item } from '../../../core/shared/item.model';

describe('CrisLayoutBoxContainerComponent', () => {
  let component: CrisLayoutBoxContainerComponent;
  let fixture: ComponentFixture<CrisLayoutBoxContainerComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    metadata: {
      'dc.title': [
        {
          language: null,
          value: 'test'
        }
      ],
      'dspace.entity.type': [
        {
          language: null,
          value: 'Person'
        }
      ]
    }
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [ CrisLayoutBoxContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrisLayoutBoxContainerComponent);
    component = fixture.componentInstance;
    component.box = boxMetadata;
    component.item = mockItem;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
