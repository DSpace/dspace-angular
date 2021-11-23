import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisrefComponent } from './crisref.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemDataService } from '../../../../../core/data/item-data.service';
import { of } from 'rxjs';
import { Item } from '../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../core/layout/models/metadata-component.model';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../../../../shared/mocks/translate-loader.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createSuccessfulRemoteDataObject$ } from '../../../../../shared/remote-data.utils';
import { SharedModule } from '../../../../../shared/shared.module';

describe('CrisrefComponent', () => {
  let component: CrisrefComponent;
  let fixture: ComponentFixture<CrisrefComponent>;
  let itemService: ItemDataService;

  const testPerson = Object.assign(new Item(), {
    id: '1',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [
        {
          value: 'Person'
        }
      ],
      'person.orgunit.id': [
        {
          value: 'OrgUnit',
          authority: '2'
        }
      ],
      'person.identifier.orcid': [
        {
          language: 'en_US',
          value: '0000-0001-8918-3592'
        }
      ],
      'cris.orcid.authenticated': [
        {
          language: null,
          value: 'authenticated'
        }
      ]
    }
  });

  const testOrgunit = Object.assign(new Item(), {
    id: '2',
    bundles: of({}),
    metadata: {
      'dspace.entity.type': [
        {
          value: 'OrgUnit'
        }
      ],
      'orgunit.person.id': [
        {
          value: 'Person',
          authority: '1'
        }
      ],
    }
  });

  const testField = Object.assign({
    id: 1,
    label: 'Field Label',
    style: 'col-md-6',
    metadata: 'person.orgunit.id'
  }) as LayoutField;

  const testOrcidField = Object.assign({
    id: 1,
    label: 'Orcid Field Label',
    style: 'col-md-6',
    metadata: 'orgunit.person.id'
  }) as LayoutField;

  itemService = Object.assign( {
    findById: (id: string) => {
      if (id === '1') {
        return createSuccessfulRemoteDataObject$(testPerson);
      } else {
        return createSuccessfulRemoteDataObject$(testOrgunit);
      }
    }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule
      ],
      declarations: [ CrisrefComponent ],
      providers: [
        { provide: ItemDataService, useValue: itemService },
      ]
    })
    .compileComponents();
  }));

  describe('Check Orgunit icon', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CrisrefComponent);
      component = fixture.componentInstance;
      component.item = testPerson;
      component.field = testField;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should has orgunit icon', () => {
      component.ngOnInit();
      fixture.detectChanges();
      const icon = fixture.debugElement.query(By.css('.fa-university'));

      expect(icon).toBeTruthy();
    });

  });

  describe('Check Orcid icon', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(CrisrefComponent);
      component = fixture.componentInstance;
      component.item = testOrgunit;
      component.field = testOrcidField;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should has orcid icon', () => {
      const icon = fixture.debugElement.query(By.css('.orcid-icon'));

      expect(icon).toBeTruthy();
    });
  });

});
