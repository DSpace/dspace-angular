import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LongtextComponent } from './longtext.component';
import { TruncatePipe } from '../../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../../../../core/shared/item.model';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { LayoutField } from '../../../../../core/layout/models/metadata-component.model';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';

describe('LongtextComponent', () => {
  let component: LongtextComponent;
  let fixture: ComponentFixture<LongtextComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title'
        }
      ]
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'dc.title'
  }) as LayoutField;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock
        }
      })],
      declarations: [LongtextComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LongtextComponent);
    component = fixture.componentInstance;
    component.item = testItem;
    component.field = testField;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the label', () => {
    const label = fixture.debugElement.query(By.css('span.lbl'));
    expect(component.hasLabel).toBeTrue();
    expect(label).not.toBeNull();
  });

  it('should has the style class', () => {
    const container = fixture.debugElement.query(By.css('div.' + testField.style));
    expect(container).not.toBeNull();
  });

  it('should get the item metadata value', () => {
    expect(component.metadataValues[0]).toEqual(testItem.metadata[testField.metadata][0].value);
  });
});
