import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import { Item } from '@dspace/core/shared/item.model';
import { MetadataValue } from '@dspace/core/shared/metadata.models';
import { TranslateLoaderMock } from '@dspace/core/testing/translate-loader.mock';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { FieldRenderingType } from '../field-rendering-type';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  const metadataValues = [
    Object.assign(new MetadataValue(), { value: 'HKU', language: null, authority: null, confidence: -1, place: 0 }),
    Object.assign(new MetadataValue(), { value: 'ASDF', language: null, authority: null, confidence: -1, place: 1 }),
  ];

  const testItem = Object.assign(new Item(), {
    type: 'item',
    metadata: {
      'dc.subject': metadataValues,
    },
    uuid: 'test-item-uuid',
  });

  const mockField: LayoutField = {
    metadata: 'dc.subject',
    label: 'Subject',
    rendering: FieldRenderingType.TAG,
    fieldType: 'METADATA',
    style: 'test-style',
    styleLabel: 'test-style-label',
    styleValue: 'test-style-value',
    labelAsHeading: false,
    valuesInline: true,
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          },
        }),
        BrowserAnimationsModule,
        TagComponent,
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: testItem },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have chips', () => {
    const chips = fixture.debugElement.query(By.css('ds-chips'));
    expect(chips).toBeTruthy();
  });

  it('should have the right chip values if it has no indexToBeRendered', () => {
    const chipLabelsFound = fixture.debugElement.queryAll(By.css('p.chip-label'));
    expect(chipLabelsFound.length).toBe(2);
    expect(chipLabelsFound[0].nativeElement.textContent).toContain('HKU');
    expect(chipLabelsFound[1].nativeElement.textContent).toContain('ASDF');
  });

  it('should render single chip item if it has indexToBeRendered', () => {
    component.indexToBeRendered = 1;
    component.ngOnInit();
    fixture.detectChanges();

    const chipLabelsFound = fixture.debugElement.queryAll(By.css('p.chip-label'));
    expect(chipLabelsFound.length).toBe(1);
    expect(chipLabelsFound[0].nativeElement.textContent).toContain('ASDF');
  });
});
