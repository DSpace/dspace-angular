import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentifierComponent } from './identifier.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { of } from 'rxjs';
import { Field } from 'src/app/core/layout/models/metadata-component.model';
import { By } from '@angular/platform-browser';
import { ResolverStrategyService } from 'src/app/layout/services/resolver-strategy.service';

describe('IdentifierComponent', () => {
  let component: IdentifierComponent;
  let fixture: ComponentFixture<IdentifierComponent>;
  let service: ResolverStrategyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentifierComponent ],
      providers: [
        { provide: ResolverStrategyService, useClass: ResolverStrategyService }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentifierComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ResolverStrategyService);
  });

  describe('Test doi rendering without subtype', () => {
    const doiTestItem = Object.assign(new Item(), {
      bundles: of({}),
      metadata: {
        'dc.identifier.doi': [
          {
            value: 'doi:10.1392/dironix'
          }
        ]
      }
    });

    const doiTestField = Object.assign({
      id: 1,
      label: 'Field Label',
      style: 'col-md-6',
      metadata: 'dc.identifier.doi'
    }) as Field;

    beforeEach(() => {
      component.item = doiTestItem;
      component.field = doiTestField;
      fixture.detectChanges();
    });

    it('Test href and text values', () => {
      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = doiTestItem.firstMetadataValue( doiTestField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toEqual(
        metadataValue.replace('doi:', '')
      );
      expect(valueContainer.nativeElement.href).toEqual(
        service.getBaseUrl('doi') + metadataValue.replace('doi:', '')
      );
    });
  });

  describe('Test doi rendering with subtype', () => {
    const doiWithoutUrnTestItem = Object.assign(new Item(), {
      bundles: of({}),
      metadata: {
        'dc.identifier.doi': [
          {
            value: '10.1392/dironix'
          }
        ]
      }
    });

    const doiTestField = Object.assign({
      id: 1,
      label: 'Field Label',
      style: 'col-md-6',
      metadata: 'dc.identifier.doi'
    }) as Field;

    beforeEach(() => {
      component.item = doiWithoutUrnTestItem;
      component.field = doiTestField;
      component.subtype = 'doi';
      fixture.detectChanges();
    });

    it('Test href and text values', () => {
      fixture.detectChanges();

      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = doiWithoutUrnTestItem.firstMetadataValue( doiTestField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toEqual(
        metadataValue
      );
      expect(valueContainer.nativeElement.href).toEqual(
        service.getBaseUrl('doi') + metadataValue
      );
    });
  });

  describe('Test email rendering', () => {
    const mailTestItem = Object.assign(new Item(), {
      bundles: of({}),
      metadata: {
        'person.email': [
          {
            value: 'mailto:danilo.dinuzzo@4science.it'
          }
        ]
      }
    });

    const mailTestField = Object.assign({
      id: 1,
      label: 'Email',
      style: 'col-md-6',
      metadata: 'person.email'
    }) as Field;

    beforeEach(() => {
      component.item = mailTestItem;
      component.field = mailTestField;
      fixture.detectChanges();
    });

    it('Test href and text values', () => {
      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = mailTestItem.firstMetadataValue( mailTestField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toEqual(
        metadataValue.replace('mailto:', '')
      );
      expect(valueContainer.nativeElement.href).toEqual(
        service.getBaseUrl('mailto') + metadataValue.replace('mailto:', '')
      );
    });
  });

  describe('Test hdl rendering', () => {
    const hdlTestItem = Object.assign(new Item(), {
      bundles: of({}),
      metadata: {
        'dc.identifier.hdl': [
          {
            value: 'hdl:2434/690937'
          }
        ]
      }
    });

    const hdlTestField = Object.assign({
      id: 1,
      label: 'hdl',
      style: 'col-md-6',
      metadata: 'dc.identifier.hdl'
    }) as Field;

    beforeEach(() => {
      component.item = hdlTestItem;
      component.field = hdlTestField;
      fixture.detectChanges();
    });

    it('Test href and text values', () => {
      const valueContainer = fixture.debugElement.query(By.css('a'));
      const metadataValue = hdlTestItem.firstMetadataValue( hdlTestField.metadata );
      expect(valueContainer.nativeElement.textContent.trim()).toEqual(
        metadataValue.replace('hdl:', '')
      );
      expect(valueContainer.nativeElement.href).toEqual(
        service.getBaseUrl('hdl') + metadataValue.replace('hdl:', '')
      );
    });
  });
});
