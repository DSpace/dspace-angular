import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { ItemPageCcLicenseFieldComponent } from '../../../../../../../item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { CcLicenseLargeComponent } from './cc-license-large.component';

describe('CcLicenseLargeComponent', () => {
  let component: CcLicenseLargeComponent;
  let fixture: ComponentFixture<CcLicenseLargeComponent>;

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
        CcLicenseLargeComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: 'fieldProvider', useValue: mockField },
        { provide: 'itemProvider', useValue: mockItem },
        { provide: 'metadataValueProvider', useValue: {} },
        { provide: 'renderingSubTypeProvider', useValue: '' },
        { provide: 'tabNameProvider', useValue: '' },
      ],
    }).overrideComponent(CcLicenseLargeComponent, {
      remove: {
        imports: [ItemPageCcLicenseFieldComponent],
      },
    })
      .compileComponents();

    fixture = TestBed.createComponent(CcLicenseLargeComponent);
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
