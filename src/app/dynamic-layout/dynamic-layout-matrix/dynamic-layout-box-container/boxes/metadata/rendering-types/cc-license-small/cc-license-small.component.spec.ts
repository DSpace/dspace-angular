import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ItemPageCcLicenseFieldComponent } from '../../../../../../../item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { CcLicenseSmallComponent } from './cc-license-small.component';

describe('CcLicenseSmallComponent', () => {
  let component: CcLicenseSmallComponent;
  let fixture: ComponentFixture<CcLicenseSmallComponent>;

  const mockItem = {
    firstMetadataValue: jasmine.createSpy('firstMetadataValue').and.returnValue(''),
    metadata: {},
    findMetadataSortedByPlace: jasmine.createSpy('findMetadataSortedByPlace').and.returnValue([]),
  };

  const mockField = {
    metadataGroup: { elements: [] },
    styleValue: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CcLicenseSmallComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: mockItem },
        { provide: 'metadataValueProvider', useValue: {} },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
    }).overrideComponent(CcLicenseSmallComponent, {
      remove: {
        imports: [ItemPageCcLicenseFieldComponent],
      },
    })
      .compileComponents();

    fixture = TestBed.createComponent(CcLicenseSmallComponent);
    component = fixture.componentInstance;

    component.componentsToBeRenderedMap.set(0, [
      { field: { metadata: 'dc.rights' } as any, value: {} as any },
      { field: { metadata: 'dc.rights.uri' } as any, value: {} as any },
    ] as any);

    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
