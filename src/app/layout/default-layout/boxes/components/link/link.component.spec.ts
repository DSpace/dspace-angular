import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LinkComponent } from './link.component';
import { Item } from 'src/app/core/shared/item.model';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Field } from 'src/app/core/layout/models/metadata-component.model';
import { TranslateService } from '@ngx-translate/core';

describe('LinkComponent', () => {
  let component: LinkComponent;
  let fixture: ComponentFixture<LinkComponent>;

  const testItem = Object.assign(new Item(), {
    bundles: of({}),
    metadata: {
      'dc.link': [
        {
          value: 'http://rest.api/item/link/id'
        }
      ]
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'dc.link'
  }) as Field;

  const testLabelField = Object.assign({
    id: 1,
    label: 'dspace.default.label',
    style: 'col-md-6',
    metadata: 'dc.link'
  }) as Field;

  const i18nKey = 'dspace.default.label';
  const i18nLabel = 'Default Label';

  const translateServiceInstace = Object.assign({
    get: (key: string) => {
      let label = key;
      if (key === i18nKey) {
        label = i18nLabel;
      }
      return of(label);
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkComponent ],
      providers: [
        { provide: TranslateService, useValue: translateServiceInstace }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  describe('Test component link without subtype', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LinkComponent);
      component = fixture.componentInstance;
      component.item = testItem;
      component.field = testField;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be added href and text to the anchor', () => {
      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = testItem.firstMetadataValue( testField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toContain(
        metadataValue
      );
      expect(valueContainer.nativeElement.href).toContain(
        metadataValue
      );
    });
  });

  describe('Test component link with label subtype', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(LinkComponent);
      component = fixture.componentInstance;
      component.item = testItem;
      component.subtype = 'label';
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be added href and i18n key to the anchor', fakeAsync(() => {
      component.field = testField;
      fixture.detectChanges();
      tick();

      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = testItem.firstMetadataValue( testField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toContain(
        testField.label
      );
      expect(valueContainer.nativeElement.href).toContain(
        metadataValue
      );
    }));

    it('should be added href and i18n lablel to the anchor', fakeAsync(() => {
      component.field = testLabelField;
      fixture.detectChanges();
      tick();

      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = testItem.firstMetadataValue( testLabelField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toContain(
        i18nLabel
      );
      expect(valueContainer.nativeElement.href).toContain(
        metadataValue
      );
    }));
  });
});
