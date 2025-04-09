import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { BrowseDefinitionDataServiceStub } from '../../../../../shared/testing/browse-definition-data-service.stub';
import { TranslateLoaderMock } from '../../../../../shared/testing/translate-loader.mock';
import { MetadataValuesComponent } from '../../../../field-components/metadata-values/metadata-values.component';
import { GenericItemPageFieldComponent } from '../generic/generic-item-page-field.component';
import { ImageField } from '../image-field';
import { mockItemWithMetadataFieldsAndValue } from '../item-page-field.component.spec';
import { ItemPageImgFieldComponent } from './item-page-img-field.component';

let component: ItemPageImgFieldComponent;
let fixture: ComponentFixture<ItemPageImgFieldComponent>;

const mockField = 'organization.identifier.ror';
const mockValue = 'http://ror.org/awesome-identifier';
const mockLabel = 'ROR label';
const mockUrlRegex = '(.*)ror.org';
const mockImg = {
  URI: './assets/images/ror-icon.svg',
  alt: 'item.page.image.alt.ROR',
  heightVar: '--ds-item-page-img-field-ror-inline-height',
} as ImageField;

describe('ItemPageImgFieldComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), GenericItemPageFieldComponent, MetadataValuesComponent, ItemPageImgFieldComponent],
      providers: [
        { provide: APP_CONFIG, useValue: environment },
        { provide: BrowseDefinitionDataService, useValue: BrowseDefinitionDataServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(GenericItemPageFieldComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ItemPageImgFieldComponent);
    component = fixture.componentInstance;
    component.item = mockItemWithMetadataFieldsAndValue([mockField], mockValue);
    component.fields = [mockField];
    component.label = mockLabel;
    component.urlRegex = mockUrlRegex;
    component.img = mockImg;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display display img tag', () => {
    const image = fixture.debugElement.query(By.css('img.link-logo'));
    expect(image).not.toBeNull();
  });

  it('should have right attributes', () => {
    const image = fixture.debugElement.query(By.css('img.link-logo'));
    expect(image.attributes.src).toEqual(mockImg.URI);
    expect(image.attributes.alt).toEqual(mockImg.alt);

    const imageEl = image.nativeElement;
    expect(imageEl.style.height).toContain(mockImg.heightVar);
  });

  it('should have the right value', () => {
    const imageAnchor = fixture.debugElement.query(By.css('a.link-anchor'));
    const anchorEl = imageAnchor.nativeElement;
    expect(anchorEl.innerHTML).toContain(mockValue);
  });
});
